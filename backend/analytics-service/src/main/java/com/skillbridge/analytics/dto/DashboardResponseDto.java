package com.skillbridge.analytics.dto;

import com.skillbridge.common.model.ActivityLog;
import com.skillbridge.common.model.StudentSkill;

import java.util.List;
import java.util.Map;

public class DashboardResponseDto {
    private String studentName;
    private String targetRole;
    private Integer competencyCoverage;
    private List<StudentSkill> verifiedSkills;
    private List<StudentSkill> partialSkills;
    private List<StudentSkill> missingSkills;
    private Map<String, Object> nextBestAction;
    private List<ActivityLog> recentActivity;
    private Integer jobMatchesCount;

    public DashboardResponseDto() {}

    public DashboardResponseDto(String studentName, String targetRole, Integer competencyCoverage, List<StudentSkill> verifiedSkills, List<StudentSkill> partialSkills, List<StudentSkill> missingSkills, Map<String, Object> nextBestAction, List<ActivityLog> recentActivity, Integer jobMatchesCount) {
        this.studentName = studentName;
        this.targetRole = targetRole;
        this.competencyCoverage = competencyCoverage;
        this.verifiedSkills = verifiedSkills;
        this.partialSkills = partialSkills;
        this.missingSkills = missingSkills;
        this.nextBestAction = nextBestAction;
        this.recentActivity = recentActivity;
        this.jobMatchesCount = jobMatchesCount;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public Integer getCompetencyCoverage() { return competencyCoverage; }
    public void setCompetencyCoverage(Integer competencyCoverage) { this.competencyCoverage = competencyCoverage; }

    public List<StudentSkill> getVerifiedSkills() { return verifiedSkills; }
    public void setVerifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; }

    public List<StudentSkill> getPartialSkills() { return partialSkills; }
    public void setPartialSkills(List<StudentSkill> partialSkills) { this.partialSkills = partialSkills; }

    public List<StudentSkill> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<StudentSkill> missingSkills) { this.missingSkills = missingSkills; }

    public Map<String, Object> getNextBestAction() { return nextBestAction; }
    public void setNextBestAction(Map<String, Object> nextBestAction) { this.nextBestAction = nextBestAction; }

    public List<ActivityLog> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityLog> recentActivity) { this.recentActivity = recentActivity; }

    public Integer getJobMatchesCount() { return jobMatchesCount; }
    public void setJobMatchesCount(Integer jobMatchesCount) { this.jobMatchesCount = jobMatchesCount; }

    public static DashboardResponseDtoBuilder builder() { return new DashboardResponseDtoBuilder(); }

    public static class DashboardResponseDtoBuilder {
        private String studentName;
        private String targetRole;
        private Integer competencyCoverage;
        private List<StudentSkill> verifiedSkills;
        private List<StudentSkill> partialSkills;
        private List<StudentSkill> missingSkills;
        private Map<String, Object> nextBestAction;
        private List<ActivityLog> recentActivity;
        private Integer jobMatchesCount;

        public DashboardResponseDtoBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public DashboardResponseDtoBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public DashboardResponseDtoBuilder competencyCoverage(Integer competencyCoverage) { this.competencyCoverage = competencyCoverage; return this; }
        public DashboardResponseDtoBuilder verifiedSkills(List<StudentSkill> verifiedSkills) { this.verifiedSkills = verifiedSkills; return this; }
        public DashboardResponseDtoBuilder partialSkills(List<StudentSkill> partialSkills) { this.partialSkills = partialSkills; return this; }
        public DashboardResponseDtoBuilder missingSkills(List<StudentSkill> missingSkills) { this.missingSkills = missingSkills; return this; }
        public DashboardResponseDtoBuilder nextBestAction(Map<String, Object> nextBestAction) { this.nextBestAction = nextBestAction; return this; }
        public DashboardResponseDtoBuilder recentActivity(List<ActivityLog> recentActivity) { this.recentActivity = recentActivity; return this; }
        public DashboardResponseDtoBuilder jobMatchesCount(Integer jobMatchesCount) { this.jobMatchesCount = jobMatchesCount; return this; }

        public DashboardResponseDto build() {
            return new DashboardResponseDto(studentName, targetRole, competencyCoverage, verifiedSkills, partialSkills, missingSkills, nextBestAction, recentActivity, jobMatchesCount);
        }
    }
}
