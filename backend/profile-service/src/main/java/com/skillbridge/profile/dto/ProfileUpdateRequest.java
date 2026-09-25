package com.skillbridge.profile.dto;

public class ProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String education;
    private String experienceLevel;
    private String targetRoleId;
    private String targetRoleTitle;
    private String resumeUrl;

    public ProfileUpdateRequest() {}

    public ProfileUpdateRequest(String fullName, String phone, String education, String experienceLevel, String targetRoleId, String targetRoleTitle, String resumeUrl) {
        this.fullName = fullName;
        this.phone = phone;
        this.education = education;
        this.experienceLevel = experienceLevel;
        this.targetRoleId = targetRoleId;
        this.targetRoleTitle = targetRoleTitle;
        this.resumeUrl = resumeUrl;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getTargetRoleId() { return targetRoleId; }
    public void setTargetRoleId(String targetRoleId) { this.targetRoleId = targetRoleId; }

    public String getTargetRoleTitle() { return targetRoleTitle; }
    public void setTargetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}
