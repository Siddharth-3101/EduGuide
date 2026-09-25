package com.skillbridge.assessment.service;

import com.skillbridge.assessment.dto.AssessmentResultDto;
import com.skillbridge.assessment.dto.AssessmentSubmissionRequest;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.EvidenceType;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final EvidenceRepository evidenceRepository;
    private final ActivityLogRepository activityLogRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, AssessmentQuestionRepository questionRepository, AssessmentAttemptRepository attemptRepository, StudentSkillRepository studentSkillRepository, EvidenceRepository evidenceRepository, ActivityLogRepository activityLogRepository) {
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.evidenceRepository = evidenceRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found with ID: " + id));
    }

    public List<AssessmentQuestion> getQuestions(Long assessmentId) {
        getAssessmentById(assessmentId);
        return questionRepository.findByAssessmentId(assessmentId);
    }

    @Transactional
    public AssessmentResultDto submitAssessment(Long userId, Long assessmentId, AssessmentSubmissionRequest request) {
        Assessment assessment = getAssessmentById(assessmentId);
        List<AssessmentQuestion> questions = questionRepository.findByAssessmentId(assessmentId);

        int correctCount = 0;
        int totalQuestions = questions.isEmpty() ? 1 : questions.size();

        if (request != null && request.getAnswers() != null) {
            Map<Long, Integer> answers = request.getAnswers();
            for (AssessmentQuestion q : questions) {
                Integer selectedOpt = answers.get(q.getId());
                if (selectedOpt != null && selectedOpt.equals(q.getCorrectOptionIndex())) {
                    correctCount++;
                }
            }
        } else {
            correctCount = totalQuestions;
        }

        int scorePercentage = (int) Math.round(((double) correctCount / totalQuestions) * 100);
        boolean passed = scorePercentage >= assessment.getPassScore();
        String level = scorePercentage >= 85 ? "Advanced" : (scorePercentage >= 70 ? "Intermediate" : "Beginner");

        AssessmentAttempt attempt = AssessmentAttempt.builder()
                .userId(userId)
                .assessmentId(assessment.getId())
                .assessmentTitle(assessment.getTitle())
                .skillId(assessment.getSkillId())
                .score(scorePercentage)
                .passed(passed)
                .competencyLevel(level)
                .build();

        AssessmentAttempt savedAttempt = attemptRepository.save(attempt);

        String verificationMsg;
        if (passed) {
            StudentSkill studentSkill = studentSkillRepository.findByUserIdAndSkillId(userId, assessment.getSkillId())
                    .orElseGet(() -> StudentSkill.builder()
                            .userId(userId)
                            .skillId(assessment.getSkillId())
                            .name(assessment.getSkillId().toUpperCase())
                            .category("Programming")
                            .build());

            studentSkill.setStatus(SkillStatus.VERIFIED);
            studentSkill.setScore(Math.max(studentSkill.getScore() != null ? studentSkill.getScore() : 0, scorePercentage));
            studentSkill.setEvidenceCount((studentSkill.getEvidenceCount() != null ? studentSkill.getEvidenceCount() : 0) + 1);
            studentSkill.setLevel(level);
            studentSkillRepository.save(studentSkill);

            Evidence evidence = Evidence.builder()
                    .userId(userId)
                    .skillId(assessment.getSkillId())
                    .name("Passed " + assessment.getTitle())
                    .type(EvidenceType.ASSESSMENT)
                    .score(scorePercentage + "%")
                    .status("VERIFIED")
                    .verifiedAt("Just now")
                    .build();
            evidenceRepository.save(evidence);

            ActivityLog log = ActivityLog.builder()
                    .userId(userId)
                    .activityType(com.skillbridge.common.model.enums.ActivityType.ASSESSMENT_COMPLETED)
                    .title("Assessment Passed")
                    .description("Passed " + assessment.getTitle() + " with " + scorePercentage + "% score.")
                    .build();
            activityLogRepository.save(log);

            verificationMsg = "Assessment passed! Skill '" + assessment.getSkillId() + "' has been updated to VERIFIED.";
        } else {
            verificationMsg = "Assessment completed. Score was " + scorePercentage + "%. Pass threshold is " + assessment.getPassScore() + "%.";
        }

        return AssessmentResultDto.builder()
                .attempt(savedAttempt)
                .skillVerificationStatus(passed ? "VERIFIED" : "UNVERIFIED")
                .message(verificationMsg)
                .build();
    }

    public AssessmentAttempt getAttemptResult(Long resultId) {
        return attemptRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment attempt result not found: " + resultId));
    }

    public List<AssessmentAttempt> getHistory(Long userId) {
        return attemptRepository.findByUserId(userId);
    }
}
