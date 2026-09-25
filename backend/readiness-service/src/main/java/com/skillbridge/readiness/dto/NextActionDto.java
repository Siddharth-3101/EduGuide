package com.skillbridge.readiness.dto;

public class NextActionDto {
    private String actionType; // ASSESSMENT, LEARNING, PROJECT, JOB_APPLICATION
    private String title;
    private String description;
    private String skillId;
    private Long assessmentId;
    private Long courseId;
    private Long projectId;
    private String priority;

    public NextActionDto() {}

    public NextActionDto(String actionType, String title, String description, String skillId,
                         Long assessmentId, Long courseId, Long projectId, String priority) {
        this.actionType = actionType;
        this.title = title;
        this.description = description;
        this.skillId = skillId;
        this.assessmentId = assessmentId;
        this.courseId = courseId;
        this.projectId = projectId;
        this.priority = priority;
    }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String actionType;
        private String title;
        private String description;
        private String skillId;
        private Long assessmentId;
        private Long courseId;
        private Long projectId;
        private String priority;

        public Builder actionType(String actionType) { this.actionType = actionType; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder skillId(String skillId) { this.skillId = skillId; return this; }
        public Builder assessmentId(Long assessmentId) { this.assessmentId = assessmentId; return this; }
        public Builder courseId(Long courseId) { this.courseId = courseId; return this; }
        public Builder projectId(Long projectId) { this.projectId = projectId; return this; }
        public Builder priority(String priority) { this.priority = priority; return this; }

        public NextActionDto build() {
            return new NextActionDto(actionType, title, description, skillId, assessmentId, courseId, projectId, priority);
        }
    }
}

