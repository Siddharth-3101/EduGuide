package com.skillbridge.analytics.service;

import com.skillbridge.analytics.dto.DashboardResponseDto;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final StudentProfileRepository studentProfileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final CareerCompetencyRepository careerCompetencyRepository;
    private final ActivityLogRepository activityLogRepository;
    private final JobRepository jobRepository;

    public AnalyticsService(StudentProfileRepository studentProfileRepository, StudentSkillRepository studentSkillRepository, CareerCompetencyRepository careerCompetencyRepository, ActivityLogRepository activityLogRepository, JobRepository jobRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.careerCompetencyRepository = careerCompetencyRepository;
        this.activityLogRepository = activityLogRepository;
        this.jobRepository = jobRepository;
    }

    public DashboardResponseDto getDashboardData(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        String studentName = profile != null ? profile.getFullName() : "Student";
        String targetRoleId = profile != null && profile.getTargetRoleId() != null ? profile.getTargetRoleId() : "backend-developer";
        String targetRoleTitle = profile != null && profile.getTargetRoleTitle() != null ? profile.getTargetRoleTitle() : "Backend Developer";

        List<StudentSkill> allStudentSkills = studentSkillRepository.findByUserId(userId);
        List<CareerCompetency> requiredCompetencies = careerCompetencyRepository.findByRoleId(targetRoleId);

        List<StudentSkill> verified = allStudentSkills.stream().filter(s -> s.getStatus() == SkillStatus.VERIFIED).collect(Collectors.toList());
        List<StudentSkill> partial = allStudentSkills.stream().filter(s -> s.getStatus() == SkillStatus.PARTIAL || s.getStatus() == SkillStatus.CLAIMED).collect(Collectors.toList());
        List<StudentSkill> missing = allStudentSkills.stream().filter(s -> s.getStatus() == SkillStatus.MISSING).collect(Collectors.toList());

        double satisfiedWeight = 0.0;
        double totalWeight = 0.0;

        for (CareerCompetency cc : requiredCompetencies) {
            double weight = cc.getImportanceWeight() != null ? cc.getImportanceWeight() : 1.0;
            totalWeight += weight;

            Optional<StudentSkill> found = allStudentSkills.stream()
                    .filter(s -> s.getSkillId().equalsIgnoreCase(cc.getSkillId()))
                    .findFirst();

            if (found.isPresent()) {
                if (found.get().getStatus() == SkillStatus.VERIFIED) {
                    satisfiedWeight += weight * 1.0;
                } else if (found.get().getStatus() == SkillStatus.PARTIAL || found.get().getStatus() == SkillStatus.CLAIMED) {
                    satisfiedWeight += weight * 0.5;
                }
            }
        }

        int coverage = totalWeight > 0 ? (int) Math.round((satisfiedWeight / totalWeight) * 100) : 67;

        Map<String, Object> nextAction = Map.of(
                "actionType", "ASSESSMENT",
                "title", "Complete Docker Verification",
                "description", "Verifying Docker could improve your competency coverage for " + targetRoleTitle + " by 14%.",
                "skillId", "docker",
                "assessmentId", 1,
                "priority", "HIGH"
        );

        List<ActivityLog> recentActivity = activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (recentActivity.isEmpty()) {
            recentActivity = Arrays.asList(
                    ActivityLog.builder().userId(userId).title("Skill Verified").description("Verified REST API skill").build(),
                    ActivityLog.builder().userId(userId).title("Career Role Selected").description("Selected " + targetRoleTitle + " as target goal").build()
            );
        }

        long jobCount = jobRepository.count();

        return DashboardResponseDto.builder()
                .studentName(studentName)
                .targetRole(targetRoleTitle)
                .competencyCoverage(coverage)
                .verifiedSkills(verified)
                .partialSkills(partial)
                .missingSkills(missing)
                .nextBestAction(nextAction)
                .recentActivity(recentActivity)
                .jobMatchesCount((int) jobCount)
                .build();
    }

    public List<ActivityLog> getActivityLogs(Long userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> getSkillProgressMetrics(Long userId) {
        List<StudentSkill> skills = studentSkillRepository.findByUserId(userId);
        long verifiedCount = skills.stream().filter(s -> s.getStatus() == SkillStatus.VERIFIED).count();
        long partialCount = skills.stream().filter(s -> s.getStatus() == SkillStatus.PARTIAL || s.getStatus() == SkillStatus.CLAIMED).count();
        long missingCount = skills.stream().filter(s -> s.getStatus() == SkillStatus.MISSING).count();

        return Map.of(
                "totalTrackedSkills", skills.size(),
                "verifiedCount", verifiedCount,
                "partialCount", partialCount,
                "missingCount", missingCount,
                "skills", skills
        );
    }

    public Map<String, Object> getCareerProgressMetrics(Long userId) {
        DashboardResponseDto dto = getDashboardData(userId);
        return Map.of(
                "targetRole", dto.getTargetRole(),
                "competencyCoverage", dto.getCompetencyCoverage(),
                "historicalCoverage", Arrays.asList(
                        Map.of("month", "Jan", "coverage", 30),
                        Map.of("month", "Feb", "coverage", 45),
                        Map.of("month", "Mar", "coverage", dto.getCompetencyCoverage())
                )
        );
    }
}
