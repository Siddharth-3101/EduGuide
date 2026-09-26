package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pathways")
public class Pathway {
    @Id
    private String id; // e.g. PATH-BACKEND-PY

    @Column(nullable = false)
    private String careerRoleId; // e.g. backend-developer or CAR-BACKEND

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer stageCount;
    private Integer skillCount;

    public Pathway() {}

    public Pathway(String id, String careerRoleId, String title, String description, Integer stageCount, Integer skillCount) {
        this.id = id;
        this.careerRoleId = careerRoleId;
        this.title = title;
        this.description = description;
        this.stageCount = stageCount;
        this.skillCount = skillCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCareerRoleId() { return careerRoleId; }
    public void setCareerRoleId(String careerRoleId) { this.careerRoleId = careerRoleId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getStageCount() { return stageCount; }
    public void setStageCount(Integer stageCount) { this.stageCount = stageCount; }

    public Integer getSkillCount() { return skillCount; }
    public void setSkillCount(Integer skillCount) { this.skillCount = skillCount; }

    public static PathwayBuilder builder() { return new PathwayBuilder(); }

    public static class PathwayBuilder {
        private String id;
        private String careerRoleId;
        private String title;
        private String description;
        private Integer stageCount;
        private Integer skillCount;

        public PathwayBuilder id(String id) { this.id = id; return this; }
        public PathwayBuilder careerRoleId(String careerRoleId) { this.careerRoleId = careerRoleId; return this; }
        public PathwayBuilder title(String title) { this.title = title; return this; }
        public PathwayBuilder description(String description) { this.description = description; return this; }
        public PathwayBuilder stageCount(Integer stageCount) { this.stageCount = stageCount; return this; }
        public PathwayBuilder skillCount(Integer skillCount) { this.skillCount = skillCount; return this; }

        public Pathway build() {
            return new Pathway(id, careerRoleId, title, description, stageCount, skillCount);
        }
    }
}
