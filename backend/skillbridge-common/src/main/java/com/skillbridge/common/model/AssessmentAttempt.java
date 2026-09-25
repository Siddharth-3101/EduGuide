package com.skillbridge.common.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_attempts")
public class AssessmentAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long assessmentId;

    private String assessmentTitle;
    private String skillId;
    private Integer score;
    private Boolean passed;
    private String competencyLevel;

    private LocalDateTime submittedAt;

    public AssessmentAttempt() {}

    public AssessmentAttempt(Long id, Long userId, Long assessmentId, String assessmentTitle, String skillId, Integer score, Boolean passed, String competencyLevel, LocalDateTime submittedAt) {
        this.id = id;
        this.userId = userId;
        this.assessmentId = assessmentId;
        this.assessmentTitle = assessmentTitle;
        this.skillId = skillId;
        this.score = score;
        this.passed = passed;
        this.competencyLevel = competencyLevel;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getAssessmentTitle() { return assessmentTitle; }
    public void setAssessmentTitle(String assessmentTitle) { this.assessmentTitle = assessmentTitle; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }

    public String getCompetencyLevel() { return competencyLevel; }
    public void setCompetencyLevel(String competencyLevel) { this.competencyLevel = competencyLevel; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public static AssessmentAttemptBuilder builder() { return new AssessmentAttemptBuilder(); }

    public static class AssessmentAttemptBuilder {
        private Long id;
        private Long userId;
        private Long assessmentId;
        private String assessmentTitle;
        private String skillId;
        private Integer score;
        private Boolean passed;
        private String competencyLevel;
        private LocalDateTime submittedAt;

        public AssessmentAttemptBuilder id(Long id) { this.id = id; return this; }
        public AssessmentAttemptBuilder userId(Long userId) { this.userId = userId; return this; }
        public AssessmentAttemptBuilder assessmentId(Long assessmentId) { this.assessmentId = assessmentId; return this; }
        public AssessmentAttemptBuilder assessmentTitle(String assessmentTitle) { this.assessmentTitle = assessmentTitle; return this; }
        public AssessmentAttemptBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public AssessmentAttemptBuilder score(Integer score) { this.score = score; return this; }
        public AssessmentAttemptBuilder passed(Boolean passed) { this.passed = passed; return this; }
        public AssessmentAttemptBuilder competencyLevel(String competencyLevel) { this.competencyLevel = competencyLevel; return this; }
        public AssessmentAttemptBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }

        public AssessmentAttempt build() {
            return new AssessmentAttempt(id, userId, assessmentId, assessmentTitle, skillId, score, passed, competencyLevel, submittedAt);
        }
    }
}
