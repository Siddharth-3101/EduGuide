package com.skillbridge.common.model;

import com.skillbridge.common.model.enums.ProjectStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_progress")
public class ProjectProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long projectId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    private String githubRepoUrl;
    private Integer progressPercent = 0;

    @Column(columnDefinition = "TEXT")
    private String submissionNotes;

    private Integer evaluationScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime updatedAt;

    public ProjectProgress() {}

    public ProjectProgress(Long id, Long userId, Long projectId, ProjectStatus status, String githubRepoUrl, Integer progressPercent, String submissionNotes, Integer evaluationScore, String feedback, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.status = status;
        this.githubRepoUrl = githubRepoUrl;
        this.progressPercent = progressPercent != null ? progressPercent : 0;
        this.submissionNotes = submissionNotes;
        this.evaluationScore = evaluationScore;
        this.feedback = feedback;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public String getGithubRepoUrl() { return githubRepoUrl; }
    public void setGithubRepoUrl(String githubRepoUrl) { this.githubRepoUrl = githubRepoUrl; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }

    public Integer getEvaluationScore() { return evaluationScore; }
    public void setEvaluationScore(Integer evaluationScore) { this.evaluationScore = evaluationScore; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static ProjectProgressBuilder builder() { return new ProjectProgressBuilder(); }

    public static class ProjectProgressBuilder {
        private Long id;
        private Long userId;
        private Long projectId;
        private ProjectStatus status;
        private String githubRepoUrl;
        private Integer progressPercent = 0;
        private String submissionNotes;
        private Integer evaluationScore;
        private String feedback;
        private LocalDateTime updatedAt;

        public ProjectProgressBuilder id(Long id) { this.id = id; return this; }
        public ProjectProgressBuilder userId(Long userId) { this.userId = userId; return this; }
        public ProjectProgressBuilder projectId(Long projectId) { this.projectId = projectId; return this; }
        public ProjectProgressBuilder status(ProjectStatus status) { this.status = status; return this; }
        public ProjectProgressBuilder githubRepoUrl(String githubRepoUrl) { this.githubRepoUrl = githubRepoUrl; return this; }
        public ProjectProgressBuilder progressPercent(Integer progressPercent) { this.progressPercent = progressPercent; return this; }
        public ProjectProgressBuilder submissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; return this; }
        public ProjectProgressBuilder evaluationScore(Integer evaluationScore) { this.evaluationScore = evaluationScore; return this; }
        public ProjectProgressBuilder feedback(String feedback) { this.feedback = feedback; return this; }
        public ProjectProgressBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ProjectProgress build() {
            return new ProjectProgress(id, userId, projectId, status, githubRepoUrl, progressPercent, submissionNotes, evaluationScore, feedback, updatedAt);
        }
    }
}
