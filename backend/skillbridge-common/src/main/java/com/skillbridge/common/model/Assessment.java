package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String skillId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer questionCount = 10;
    private Integer durationMinutes = 15;
    private String difficulty;
    private Integer passScore = 70;

    public Assessment() {}

    public Assessment(Long id, String skillId, String title, String description, Integer questionCount, Integer durationMinutes, String difficulty, Integer passScore) {
        this.id = id;
        this.skillId = skillId;
        this.title = title;
        this.description = description;
        this.questionCount = questionCount != null ? questionCount : 10;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 15;
        this.difficulty = difficulty;
        this.passScore = passScore != null ? passScore : 70;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getPassScore() { return passScore; }
    public void setPassScore(Integer passScore) { this.passScore = passScore; }

    public static AssessmentBuilder builder() { return new AssessmentBuilder(); }

    public static class AssessmentBuilder {
        private Long id;
        private String skillId;
        private String title;
        private String description;
        private Integer questionCount = 10;
        private Integer durationMinutes = 15;
        private String difficulty;
        private Integer passScore = 70;

        public AssessmentBuilder id(Long id) { this.id = id; return this; }
        public AssessmentBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public AssessmentBuilder title(String title) { this.title = title; return this; }
        public AssessmentBuilder description(String description) { this.description = description; return this; }
        public AssessmentBuilder questionCount(Integer questionCount) { this.questionCount = questionCount; return this; }
        public AssessmentBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public AssessmentBuilder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public AssessmentBuilder passScore(Integer passScore) { this.passScore = passScore; return this; }

        public Assessment build() {
            return new Assessment(id, skillId, title, description, questionCount, durationMinutes, difficulty, passScore);
        }
    }
}
