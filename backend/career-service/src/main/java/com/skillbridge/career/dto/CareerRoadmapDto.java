package com.skillbridge.career.dto;

import com.skillbridge.common.model.CareerCompetency;
import com.skillbridge.common.model.CareerRole;

import java.util.List;

public class CareerRoadmapDto {
    private CareerRole role;
    private List<CareerCompetency> competencies;
    private List<RoadmapStage> stages;

    public CareerRoadmapDto() {}

    public CareerRoadmapDto(CareerRole role, List<CareerCompetency> competencies, List<RoadmapStage> stages) {
        this.role = role;
        this.competencies = competencies;
        this.stages = stages;
    }

    public CareerRole getRole() { return role; }
    public void setRole(CareerRole role) { this.role = role; }

    public List<CareerCompetency> getCompetencies() { return competencies; }
    public void setCompetencies(List<CareerCompetency> competencies) { this.competencies = competencies; }

    public List<RoadmapStage> getStages() { return stages; }
    public void setStages(List<RoadmapStage> stages) { this.stages = stages; }

    public static CareerRoadmapDtoBuilder builder() { return new CareerRoadmapDtoBuilder(); }

    public static class CareerRoadmapDtoBuilder {
        private CareerRole role;
        private List<CareerCompetency> competencies;
        private List<RoadmapStage> stages;

        public CareerRoadmapDtoBuilder role(CareerRole role) { this.role = role; return this; }
        public CareerRoadmapDtoBuilder competencies(List<CareerCompetency> competencies) { this.competencies = competencies; return this; }
        public CareerRoadmapDtoBuilder stages(List<RoadmapStage> stages) { this.stages = stages; return this; }

        public CareerRoadmapDto build() { return new CareerRoadmapDto(role, competencies, stages); }
    }

    public static class RoadmapStage {
        private String stageName;
        private String description;
        private List<String> skills;
        private String estimatedDuration;

        public RoadmapStage() {}

        public RoadmapStage(String stageName, String description, List<String> skills, String estimatedDuration) {
            this.stageName = stageName;
            this.description = description;
            this.skills = skills;
            this.estimatedDuration = estimatedDuration;
        }

        public String getStageName() { return stageName; }
        public void setStageName(String stageName) { this.stageName = stageName; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }

        public String getEstimatedDuration() { return estimatedDuration; }
        public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

        public static RoadmapStageBuilder builder() { return new RoadmapStageBuilder(); }

        public static class RoadmapStageBuilder {
            private String stageName;
            private String description;
            private List<String> skills;
            private String estimatedDuration;

            public RoadmapStageBuilder stageName(String stageName) { this.stageName = stageName; return this; }
            public RoadmapStageBuilder description(String description) { this.description = description; return this; }
            public RoadmapStageBuilder skills(List<String> skills) { this.skills = skills; return this; }
            public RoadmapStageBuilder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }

            public RoadmapStage build() { return new RoadmapStage(stageName, description, skills, estimatedDuration); }
        }
    }
}
