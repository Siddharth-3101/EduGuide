package com.skillbridge.portfolio.dto;

import com.skillbridge.common.model.*;
import java.util.List;

public class PortfolioDto {
    private StudentProfile profile;
    private PortfolioProfile portfolioSettings;
    private List<StudentSkill> verifiedSkills;
    private List<StudentSkill> allSkills;
    private List<Evidence> evidenceList;
    private List<AssessmentAttempt> passedAssessments;
    private List<ProjectProgress> completedProjects;
    private String shareableUrl;

    public PortfolioDto() {}

    public PortfolioDto(StudentProfile profile, PortfolioProfile portfolioSettings, List<StudentSkill> verifiedSkills, List<StudentSkill> allSkills, List<Evidence> evidenceList, List<AssessmentAttempt> passedAssessments, List<ProjectProgress> completedProjects, String shareableUrl) {
        this.profile = profile;
        this.portfolioSettings = portfolioSettings;
        this.verifiedSkills = verifiedSkills;
        this.allSkills = allSkills;
        this.evidenceList = evidenceList;
        this.passedAssessments = passedAssessments;
        this.completedProjects = completedProjects;
        this.shareableUrl = shareableUrl;
    }

    public StudentProfile getProfile() { return profile; }
    public void setProfile(StudentProfile profile) { this.profile = profile; }

    public PortfolioProfile getPortfolioSettings() { return portfolioSettings; }
    public void setPortfolioSettings(PortfolioProfile portfolioSettings) { this.portfolioSettings = portfolioSettings; }

    public List<StudentSkill> getVerifiedSkills() { return verifiedSkills; }
    public void setVerifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; }

    public List<StudentSkill> getAllSkills() { return allSkills; }
    public void setAllSkills(List<StudentSkill> allSkills) { this.allSkills = allSkills; }

    public List<Evidence> getEvidenceList() { return evidenceList; }
    public void setEvidenceList(List<Evidence> evidenceList) { this.evidenceList = evidenceList; }

    public List<AssessmentAttempt> getPassedAssessments() { return passedAssessments; }
    public void setPassedAssessments(List<AssessmentAttempt> passedAssessments) { this.passedAssessments = passedAssessments; }

    public List<ProjectProgress> getCompletedProjects() { return completedProjects; }
    public void setCompletedProjects(List<ProjectProgress> completedProjects) { this.completedProjects = completedProjects; }

    public String getShareableUrl() { return shareableUrl; }
    public void setShareableUrl(String shareableUrl) { this.shareableUrl = shareableUrl; }

    public static PortfolioDtoBuilder builder() { return new PortfolioDtoBuilder(); }

    public static class PortfolioDtoBuilder {
        private StudentProfile profile;
        private PortfolioProfile portfolioSettings;
        private List<StudentSkill> verifiedSkills;
        private List<StudentSkill> allSkills;
        private List<Evidence> evidenceList;
        private List<AssessmentAttempt> passedAssessments;
        private List<ProjectProgress> completedProjects;
        private String shareableUrl;

        public PortfolioDtoBuilder profile(StudentProfile profile) { this.profile = profile; return this; }
        public PortfolioDtoBuilder portfolioSettings(PortfolioProfile portfolioSettings) { this.portfolioSettings = portfolioSettings; return this; }
        public PortfolioDtoBuilder verifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; return this; }
        public PortfolioDtoBuilder allSkills(List<StudentSkill> allSkills) { this.allSkills = allSkills; return this; }
        public PortfolioDtoBuilder evidenceList(List<Evidence> evidenceList) { this.evidenceList = evidenceList; return this; }
        public PortfolioDtoBuilder passedAssessments(List<AssessmentAttempt> passedAssessments) { this.passedAssessments = passedAssessments; return this; }
        public PortfolioDtoBuilder completedProjects(List<ProjectProgress> completedProjects) { this.completedProjects = completedProjects; return this; }
        public PortfolioDtoBuilder shareableUrl(String shareableUrl) { this.shareableUrl = shareableUrl; return this; }

        public PortfolioDto build() {
            return new PortfolioDto(profile, portfolioSettings, verifiedSkills, allSkills, evidenceList, passedAssessments, completedProjects, shareableUrl);
        }
    }
}
