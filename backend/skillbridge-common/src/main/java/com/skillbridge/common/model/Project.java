package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String objective;

    private String skillsCovered;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String architecture;

    private String estimatedTime;
    private String difficulty;

    @Column(columnDefinition = "TEXT")
    private String evaluationCriteria;

    @Column(columnDefinition = "TEXT")
    private String submissionRequirements;

    public Project() {}

    public Project(Long id, String title, String objective, String skillsCovered, String requirements, String architecture, String estimatedTime, String difficulty, String evaluationCriteria, String submissionRequirements) {
        this.id = id;
        this.title = title;
        this.objective = objective;
        this.skillsCovered = skillsCovered;
        this.requirements = requirements;
        this.architecture = architecture;
        this.estimatedTime = estimatedTime;
        this.difficulty = difficulty;
        this.evaluationCriteria = evaluationCriteria;
        this.submissionRequirements = submissionRequirements;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getSkillsCovered() { return skillsCovered; }
    public void setSkillsCovered(String skillsCovered) { this.skillsCovered = skillsCovered; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getArchitecture() { return architecture; }
    public void setArchitecture(String architecture) { this.architecture = architecture; }

    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getEvaluationCriteria() { return evaluationCriteria; }
    public void setEvaluationCriteria(String evaluationCriteria) { this.evaluationCriteria = evaluationCriteria; }

    public String getSubmissionRequirements() { return submissionRequirements; }
    public void setSubmissionRequirements(String submissionRequirements) { this.submissionRequirements = submissionRequirements; }

    public static ProjectBuilder builder() { return new ProjectBuilder(); }

    public static class ProjectBuilder {
        private Long id;
        private String title;
        private String objective;
        private String skillsCovered;
        private String requirements;
        private String architecture;
        private String estimatedTime;
        private String difficulty;
        private String evaluationCriteria;
        private String submissionRequirements;

        public ProjectBuilder id(Long id) { this.id = id; return this; }
        public ProjectBuilder title(String title) { this.title = title; return this; }
        public ProjectBuilder objective(String objective) { this.objective = objective; return this; }
        public ProjectBuilder skillsCovered(String skillsCovered) { this.skillsCovered = skillsCovered; return this; }
        public ProjectBuilder requirements(String requirements) { this.requirements = requirements; return this; }
        public ProjectBuilder architecture(String architecture) { this.architecture = architecture; return this; }
        public ProjectBuilder estimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; return this; }
        public ProjectBuilder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public ProjectBuilder evaluationCriteria(String evaluationCriteria) { this.evaluationCriteria = evaluationCriteria; return this; }
        public ProjectBuilder submissionRequirements(String submissionRequirements) { this.submissionRequirements = submissionRequirements; return this; }

        public Project build() {
            return new Project(id, title, objective, skillsCovered, requirements, architecture, estimatedTime, difficulty, evaluationCriteria, submissionRequirements);
        }
    }
}
