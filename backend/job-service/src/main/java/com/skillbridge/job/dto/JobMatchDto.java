package com.skillbridge.job.dto;

import com.skillbridge.common.model.Job;
import java.util.List;

public class JobMatchDto {
    private Job job;
    private Integer competencyMatchPercentage;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String matchCategory;

    public JobMatchDto() {}

    public JobMatchDto(Job job, Integer competencyMatchPercentage, List<String> matchingSkills, List<String> missingSkills, String matchCategory) {
        this.job = job;
        this.competencyMatchPercentage = competencyMatchPercentage;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.matchCategory = matchCategory;
    }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Integer getCompetencyMatchPercentage() { return competencyMatchPercentage; }
    public void setCompetencyMatchPercentage(Integer competencyMatchPercentage) { this.competencyMatchPercentage = competencyMatchPercentage; }

    public List<String> getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public String getMatchCategory() { return matchCategory; }
    public void setMatchCategory(String matchCategory) { this.matchCategory = matchCategory; }

    public static JobMatchDtoBuilder builder() { return new JobMatchDtoBuilder(); }

    public static class JobMatchDtoBuilder {
        private Job job;
        private Integer competencyMatchPercentage;
        private List<String> matchingSkills;
        private List<String> missingSkills;
        private String matchCategory;

        public JobMatchDtoBuilder job(Job job) { this.job = job; return this; }
        public JobMatchDtoBuilder competencyMatchPercentage(Integer competencyMatchPercentage) { this.competencyMatchPercentage = competencyMatchPercentage; return this; }
        public JobMatchDtoBuilder matchingSkills(List<String> matchingSkills) { this.matchingSkills = matchingSkills; return this; }
        public JobMatchDtoBuilder missingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; return this; }
        public JobMatchDtoBuilder matchCategory(String matchCategory) { this.matchCategory = matchCategory; return this; }

        public JobMatchDto build() {
            return new JobMatchDto(job, competencyMatchPercentage, matchingSkills, missingSkills, matchCategory);
        }
    }
}
