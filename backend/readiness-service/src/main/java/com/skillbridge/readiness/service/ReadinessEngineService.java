package com.skillbridge.readiness.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.GapPriority;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import com.skillbridge.readiness.dto.CareerReadinessDto;
import com.skillbridge.readiness.dto.NextActionDto;
import com.skillbridge.readiness.dto.SkillGapDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReadinessEngineService {

    private final StudentProfileRepository studentProfileRepository;
    private final CareerRoleRepository careerRoleRepository;
    private final CareerCompetencyRepository careerCompetencyRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final AssessmentRepository assessmentRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;

    public ReadinessEngineService(StudentProfileRepository studentProfileRepository,
                                  CareerRoleRepository careerRoleRepository,
                                  CareerCompetencyRepository careerCompetencyRepository,
                                  StudentSkillRepository studentSkillRepository,
                                  AssessmentRepository assessmentRepository,
                                  CourseRepository courseRepository,
                                  ProjectRepository projectRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.careerRoleRepository = careerRoleRepository;
        this.careerCompetencyRepository = careerCompetencyRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.assessmentRepository = assessmentRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
    }


    public CareerReadinessDto calculateReadiness(Long userId, String customRoleId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);

        String rawRoleId = customRoleId != null ? customRoleId :
                (profile != null && profile.getTargetRoleId() != null ? profile.getTargetRoleId() : "backend-developer");

        CareerRole role = careerRoleRepository.findByRoleId(rawRoleId)
                .orElseGet(() -> {
                    try {
                        Long numId = Long.parseLong(rawRoleId);
                        List<CareerRole> roles = careerRoleRepository.findAll();
                        if (numId > 0 && numId <= roles.size()) {
                            return roles.get((int) (numId - 1));
                        }
                    } catch (Exception ignored) {}
                    return careerRoleRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new ResourceNotFoundException("Career role not found: " + rawRoleId));
                });

        String roleId = role.getRoleId();

        List<CareerCompetency> requiredCompetencies = careerCompetencyRepository.findByRoleId(roleId);
        List<StudentSkill> studentSkills = studentSkillRepository.findByUserId(userId);

        double totalRequiredWeight = 0.0;
        double satisfiedWeight = 0.0;

        List<StudentSkill> verifiedList = new ArrayList<>();
        List<StudentSkill> partialList = new ArrayList<>();
        List<StudentSkill> missingList = new ArrayList<>();
        List<SkillGapDto> skillGaps = new ArrayList<>();

        for (CareerCompetency cc : requiredCompetencies) {
            double weight = cc.getImportanceWeight() != null ? cc.getImportanceWeight() : 1.0;
            totalRequiredWeight += weight;

            Optional<StudentSkill> match = studentSkills.stream()
                    .filter(s -> s.getSkillId().equalsIgnoreCase(cc.getSkillId()))
                    .findFirst();

            SkillStatus status = match.map(StudentSkill::getStatus).orElse(SkillStatus.MISSING);

            if (status == SkillStatus.VERIFIED) {
                satisfiedWeight += weight * 1.0;
                match.ifPresent(verifiedList::add);
            } else if (status == SkillStatus.PARTIAL || status == SkillStatus.CLAIMED) {
                satisfiedWeight += weight * 0.5;
                match.ifPresent(partialList::add);

                skillGaps.add(SkillGapDto.builder()
                        .skillId(cc.getSkillId())
                        .skillName(cc.getSkillName())
                        .currentStatus(status)
                        .requiredLevel(cc.getRequiredLevel())
                        .importanceWeight(weight)
                        .gapPriority(weight >= 1.0 ? GapPriority.HIGH : GapPriority.MEDIUM)
                        .recommendationReason("Partial competency verified. Complete assessment or project to upgrade to VERIFIED.")
                        .build());
            } else {
                // MISSING
                StudentSkill missingSkill = match.orElseGet(() -> StudentSkill.builder()
                        .userId(userId)
                        .skillId(cc.getSkillId())
                        .name(cc.getSkillName())
                        .status(SkillStatus.MISSING)
                        .build());
                missingList.add(missingSkill);

                skillGaps.add(SkillGapDto.builder()
                        .skillId(cc.getSkillId())
                        .skillName(cc.getSkillName())
                        .currentStatus(SkillStatus.MISSING)
                        .requiredLevel(cc.getRequiredLevel())
                        .importanceWeight(weight)
                        .gapPriority(weight >= 1.0 ? GapPriority.CRITICAL : GapPriority.HIGH)
                        .recommendationReason("Required skill missing for target role " + role.getTitle() + ".")
                        .build());
            }
        }

        int coverage = totalRequiredWeight > 0 ?
                (int) Math.round((satisfiedWeight / totalRequiredWeight) * 100) : 0;

        // Sort gaps by priority
        skillGaps.sort((a, b) -> Double.compare(b.getImportanceWeight(), a.getImportanceWeight()));

        // Calculate Next Best Action
        NextActionDto nextAction = determineNextBestAction(userId, skillGaps);

        // Recommendations
        List<Course> learningRecs = courseRepository.findAll();
        List<Project> projectRecs = projectRepository.findAll();

        String formulaExplanation = String.format(
                "Competency Coverage = (Satisfied Weight %.1f / Total Required Weight %.1f) * 100 = %d%%",
                satisfiedWeight, totalRequiredWeight, coverage
        );

        return CareerReadinessDto.builder()
                .targetRoleId(role.getRoleId())
                .targetRoleTitle(role.getTitle())
                .competencyCoveragePercentage(coverage)
                .calculationFormulaExplanation(formulaExplanation)
                .verifiedSkills(verifiedList)
                .partialSkills(partialList)
                .missingSkills(missingList)
                .skillGaps(skillGaps)
                .nextBestAction(nextAction)
                .learningRecommendations(learningRecs)
                .projectRecommendations(projectRecs)
                .build();
    }

    public List<SkillGapDto> getSkillGaps(Long userId) {
        return calculateReadiness(userId, null).getSkillGaps();
    }

    public NextActionDto getNextBestAction(Long userId) {
        return calculateReadiness(userId, null).getNextBestAction();
    }

    private NextActionDto determineNextBestAction(Long userId, List<SkillGapDto> gaps) {
        if (!gaps.isEmpty()) {
            SkillGapDto topGap = gaps.get(0);
            List<Assessment> assessments = assessmentRepository.findBySkillId(topGap.getSkillId());

            if (!assessments.isEmpty()) {
                Assessment a = assessments.get(0);
                return NextActionDto.builder()
                        .actionType("ASSESSMENT")
                        .title("Complete " + a.getTitle())
                        .description("Verifying " + topGap.getSkillName() + " via assessment will boost your competency coverage.")
                        .skillId(topGap.getSkillId())
                        .assessmentId(a.getId())
                        .priority("CRITICAL")
                        .build();
            } else {
                return NextActionDto.builder()
                        .actionType("LEARNING")
                        .title("Learn " + topGap.getSkillName() + " Fundamentals")
                        .description("Enroll in recommended learning track to build " + topGap.getSkillName() + " competency.")
                        .skillId(topGap.getSkillId())
                        .courseId(1L)
                        .priority("HIGH")
                        .build();
            }
        }

        return NextActionDto.builder()
                .actionType("PROJECT")
                .title("Build Containerized REST API Project")
                .description("Demonstrate your verified backend skills with practical evidence.")
                .projectId(1L)
                .priority("MEDIUM")
                .build();
    }
}
