package com.skillbridge.readiness.dto;

import com.skillbridge.common.model.enums.GapPriority;
import com.skillbridge.common.model.enums.SkillStatus;

public class SkillGapDto {
    private String skillId;
    private String skillName;
    private SkillStatus currentStatus;
    private String requiredLevel;
    private Double importanceWeight;
    private GapPriority gapPriority;
    private String recommendationReason;

    public SkillGapDto() {}

    public SkillGapDto(String skillId, String skillName, SkillStatus currentStatus, String requiredLevel, Double importanceWeight, GapPriority gapPriority, String recommendationReason) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.currentStatus = currentStatus;
        this.requiredLevel = requiredLevel;
        this.importanceWeight = importanceWeight;
        this.gapPriority = gapPriority;
        this.recommendationReason = recommendationReason;
    }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public SkillStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(SkillStatus currentStatus) { this.currentStatus = currentStatus; }

    public String getRequiredLevel() { return requiredLevel; }
    public void setRequiredLevel(String requiredLevel) { this.requiredLevel = requiredLevel; }

    public Double getImportanceWeight() { return importanceWeight; }
    public void setImportanceWeight(Double importanceWeight) { this.importanceWeight = importanceWeight; }

    public GapPriority getGapPriority() { return gapPriority; }
    public void setGapPriority(GapPriority gapPriority) { this.gapPriority = gapPriority; }

    public String getRecommendationReason() { return recommendationReason; }
    public void setRecommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; }

    public static SkillGapDtoBuilder builder() { return new SkillGapDtoBuilder(); }

    public static class SkillGapDtoBuilder {
        private String skillId;
        private String skillName;
        private SkillStatus currentStatus;
        private String requiredLevel;
        private Double importanceWeight;
        private GapPriority gapPriority;
        private String recommendationReason;

        public SkillGapDtoBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public SkillGapDtoBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public SkillGapDtoBuilder currentStatus(SkillStatus currentStatus) { this.currentStatus = currentStatus; return this; }
        public SkillGapDtoBuilder requiredLevel(String requiredLevel) { this.requiredLevel = requiredLevel; return this; }
        public SkillGapDtoBuilder importanceWeight(Double importanceWeight) { this.importanceWeight = importanceWeight; return this; }
        public SkillGapDtoBuilder gapPriority(GapPriority gapPriority) { this.gapPriority = gapPriority; return this; }
        public SkillGapDtoBuilder recommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; return this; }

        public SkillGapDto build() {
            return new SkillGapDto(skillId, skillName, currentStatus, requiredLevel, importanceWeight, gapPriority, recommendationReason);
        }
    }
}
