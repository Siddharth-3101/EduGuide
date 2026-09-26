package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roadmap_stages")
public class RoadmapStage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pathwayId;

    private Integer stageNumber;
    private String stageName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String estimatedDuration;

    @Column(columnDefinition = "TEXT")
    private String skillsJson; // JSON or comma-separated list of skill IDs / names

    public RoadmapStage() {}

    public RoadmapStage(Long id, String pathwayId, Integer stageNumber, String stageName, String description, String estimatedDuration, String skillsJson) {
        this.id = id;
        this.pathwayId = pathwayId;
        this.stageNumber = stageNumber;
        this.stageName = stageName;
        this.description = description;
        this.estimatedDuration = estimatedDuration;
        this.skillsJson = skillsJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPathwayId() { return pathwayId; }
    public void setPathwayId(String pathwayId) { this.pathwayId = pathwayId; }

    public Integer getStageNumber() { return stageNumber; }
    public void setStageNumber(Integer stageNumber) { this.stageNumber = stageNumber; }

    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getSkillsJson() { return skillsJson; }
    public void setSkillsJson(String skillsJson) { this.skillsJson = skillsJson; }

    public static RoadmapStageBuilder builder() { return new RoadmapStageBuilder(); }

    public static class RoadmapStageBuilder {
        private Long id;
        private String pathwayId;
        private Integer stageNumber;
        private String stageName;
        private String description;
        private String estimatedDuration;
        private String skillsJson;

        public RoadmapStageBuilder id(Long id) { this.id = id; return this; }
        public RoadmapStageBuilder pathwayId(String pathwayId) { this.pathwayId = pathwayId; return this; }
        public RoadmapStageBuilder stageNumber(Integer stageNumber) { this.stageNumber = stageNumber; return this; }
        public RoadmapStageBuilder stageName(String stageName) { this.stageName = stageName; return this; }
        public RoadmapStageBuilder description(String description) { this.description = description; return this; }
        public RoadmapStageBuilder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public RoadmapStageBuilder skillsJson(String skillsJson) { this.skillsJson = skillsJson; return this; }

        public RoadmapStage build() {
            return new RoadmapStage(id, pathwayId, stageNumber, stageName, description, estimatedDuration, skillsJson);
        }
    }
}
