package com.skillbridge.readiness.dto;

import com.skillbridge.common.model.Course;
import com.skillbridge.common.model.Project;
import com.skillbridge.common.model.StudentSkill;

import java.util.List;

public class CareerReadinessDto {
    private String targetRoleId;
    private String targetRoleTitle;
    private Integer competencyCoveragePercentage;
    private String calculationFormulaExplanation;
    private List<StudentSkill> verifiedSkills;
    private List<StudentSkill> partialSkills;
    private List<StudentSkill> missingSkills;
    private List<SkillGapDto> skillGaps;
    private NextActionDto nextBestAction;
    private List<Course> learningRecommendations;
    private List<Project> projectRecommendations;

    public CareerReadinessDto() {}

    public CareerReadinessDto(String targetRoleId, String targetRoleTitle, Integer competencyCoveragePercentage,
                              String calculationFormulaExplanation, List<StudentSkill> verifiedSkills,
                              List<StudentSkill> partialSkills, List<StudentSkill> missingSkills,
                              List<SkillGapDto> skillGaps, NextActionDto nextBestAction,
                              List<Course> learningRecommendations, List<Project> projectRecommendations) {
        this.targetRoleId = targetRoleId;
        this.targetRoleTitle = targetRoleTitle;
        this.competencyCoveragePercentage = competencyCoveragePercentage;
        this.calculationFormulaExplanation = calculationFormulaExplanation;
        this.verifiedSkills = verifiedSkills;
        this.partialSkills = partialSkills;
        this.missingSkills = missingSkills;
        this.skillGaps = skillGaps;
        this.nextBestAction = nextBestAction;
        this.learningRecommendations = learningRecommendations;
        this.projectRecommendations = projectRecommendations;
    }

    public String getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(String targetRoleId) { this.targetRoleId = targetRoleId; }

    public String getTargetRoleTitle() { return targetRoleTitle; }
    public void setTargetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; }

    public Integer getCompetencyCoveragePercentage() { return competencyCoveragePercentage; }
    public void setCompetencyCoveragePercentage(Integer competencyCoveragePercentage) { this.competencyCoveragePercentage = competencyCoveragePercentage; }

    public String getCalculationFormulaExplanation() { return calculationFormulaExplanation; }
    public void setCalculationFormulaExplanation(String calculationFormulaExplanation) { this.calculationFormulaExplanation = calculationFormulaExplanation; }

    public List<StudentSkill> getVerifiedSkills() { return verifiedSkills; }
    public void setVerifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; }

    public List<StudentSkill> getPartialSkills() { return partialSkills; }
    public void setPartialSkills(List<StudentSkill> partialSkills) { this.partialSkills = partialSkills; }

    public List<StudentSkill> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<StudentSkill> missingSkills) { this.missingSkills = missingSkills; }

    public List<SkillGapDto> getSkillGaps() { return skillGaps; }
    public void setSkillGaps(List<SkillGapDto> skillGaps) { this.skillGaps = skillGaps; }

    public NextActionDto getNextBestAction() { return nextBestAction; }
    public void setNextBestAction(NextActionDto nextBestAction) { this.nextBestAction = nextBestAction; }

    public List<Course> getLearningRecommendations() { return learningRecommendations; }
    public void setLearningRecommendations(List<Course> learningRecommendations) { this.learningRecommendations = learningRecommendations; }

    public List<Project> getProjectRecommendations() { return projectRecommendations; }
    public void setProjectRecommendations(List<Project> projectRecommendations) { this.projectRecommendations = projectRecommendations; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String targetRoleId;
        private String targetRoleTitle;
        private Integer competencyCoveragePercentage;
        private String calculationFormulaExplanation;
        private List<StudentSkill> verifiedSkills;
        private List<StudentSkill> partialSkills;
        private List<StudentSkill> missingSkills;
        private List<SkillGapDto> skillGaps;
        private NextActionDto nextBestAction;
        private List<Course> learningRecommendations;
        private List<Project> projectRecommendations;

        public Builder targetRoleId(String targetRoleId) { this.targetRoleId = targetRoleId; return this; }
        public Builder targetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; return this; }
        public Builder competencyCoveragePercentage(Integer competencyCoveragePercentage) { this.competencyCoveragePercentage = competencyCoveragePercentage; return this; }
        public Builder calculationFormulaExplanation(String calculationFormulaExplanation) { this.calculationFormulaExplanation = calculationFormulaExplanation; return this; }
        public Builder verifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; return this; }
        public Builder partialSkills(List<StudentSkill> partialSkills) { this.partialSkills = partialSkills; return this; }
        public Builder missingSkills(List<StudentSkill> missingSkills) { this.missingSkills = missingSkills; return this; }
        public Builder skillGaps(List<SkillGapDto> skillGaps) { this.skillGaps = skillGaps; return this; }
        public Builder nextBestAction(NextActionDto nextBestAction) { this.nextBestAction = nextBestAction; return this; }
        public Builder learningRecommendations(List<Course> learningRecommendations) { this.learningRecommendations = learningRecommendations; return this; }
        public Builder projectRecommendations(List<Project> projectRecommendations) { this.projectRecommendations = projectRecommendations; return this; }

        public CareerReadinessDto build() {
            return new CareerReadinessDto(targetRoleId, targetRoleTitle, competencyCoveragePercentage,
                    calculationFormulaExplanation, verifiedSkills, partialSkills, missingSkills,
                    skillGaps, nextBestAction, learningRecommendations, projectRecommendations);
        }
    }
}

