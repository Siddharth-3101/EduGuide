package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String platform;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;
    private String difficulty;
    private String skillsCovered;
    private String competenciesCovered;
    private Boolean isFree = true;

    @Column(columnDefinition = "TEXT")
    private String recommendationReason;

    private String url;
    private String skillId;

    public Course() {}

    public Course(Long id, String title, String platform, String description, String duration, String difficulty, String skillsCovered, String competenciesCovered, Boolean isFree, String recommendationReason, String url, String skillId) {
        this.id = id;
        this.title = title;
        this.platform = platform;
        this.description = description;
        this.duration = duration;
        this.difficulty = difficulty;
        this.skillsCovered = skillsCovered;
        this.competenciesCovered = competenciesCovered;
        this.isFree = isFree != null ? isFree : true;
        this.recommendationReason = recommendationReason;
        this.url = url;
        this.skillId = skillId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getSkillsCovered() { return skillsCovered; }
    public void setSkillsCovered(String skillsCovered) { this.skillsCovered = skillsCovered; }

    public String getCompetenciesCovered() { return competenciesCovered; }
    public void setCompetenciesCovered(String competenciesCovered) { this.competenciesCovered = competenciesCovered; }

    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean free) { isFree = free; }

    public String getRecommendationReason() { return recommendationReason; }
    public void setRecommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public static CourseBuilder builder() { return new CourseBuilder(); }

    public static class CourseBuilder {
        private Long id;
        private String title;
        private String platform;
        private String description;
        private String duration;
        private String difficulty;
        private String skillsCovered;
        private String competenciesCovered;
        private Boolean isFree = true;
        private String recommendationReason;
        private String url;
        private String skillId;

        public CourseBuilder id(Long id) { this.id = id; return this; }
        public CourseBuilder title(String title) { this.title = title; return this; }
        public CourseBuilder platform(String platform) { this.platform = platform; return this; }
        public CourseBuilder description(String description) { this.description = description; return this; }
        public CourseBuilder duration(String duration) { this.duration = duration; return this; }
        public CourseBuilder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public CourseBuilder skillsCovered(String skillsCovered) { this.skillsCovered = skillsCovered; return this; }
        public CourseBuilder competenciesCovered(String competenciesCovered) { this.competenciesCovered = competenciesCovered; return this; }
        public CourseBuilder isFree(Boolean isFree) { this.isFree = isFree; return this; }
        public CourseBuilder recommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; return this; }
        public CourseBuilder url(String url) { this.url = url; return this; }
        public CourseBuilder skillId(String skillId) { this.skillId = skillId; return this; }

        public Course build() {
            return new Course(id, title, platform, description, duration, difficulty, skillsCovered, competenciesCovered, isFree, recommendationReason, url, skillId);
        }
    }
}
