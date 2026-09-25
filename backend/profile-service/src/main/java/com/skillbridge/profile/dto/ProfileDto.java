package com.skillbridge.profile.dto;

public class ProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String education;
    private String experienceLevel;
    private String targetRoleId;
    private String targetRoleTitle;
    private String resumeUrl;
    private String certificatesJson;

    public ProfileDto() {}

    public ProfileDto(Long id, Long userId, String fullName, String email, String phone, String education, String experienceLevel, String targetRoleId, String targetRoleTitle, String resumeUrl, String certificatesJson) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.education = education;
        this.experienceLevel = experienceLevel;
        this.targetRoleId = targetRoleId;
        this.targetRoleTitle = targetRoleTitle;
        this.resumeUrl = resumeUrl;
        this.certificatesJson = certificatesJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public String getCertificatesJson() { return certificatesJson; }
    public void setCertificatesJson(String certificatesJson) { this.certificatesJson = certificatesJson; }

    public static ProfileDtoBuilder builder() { return new ProfileDtoBuilder(); }

    public static class ProfileDtoBuilder {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String phone;
        private String education;
        private String experienceLevel;
        private String targetRoleId;
        private String targetRoleTitle;
        private String resumeUrl;
        private String certificatesJson;

        public ProfileDtoBuilder id(Long id) { this.id = id; return this; }
        public ProfileDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public ProfileDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public ProfileDtoBuilder email(String email) { this.email = email; return this; }
        public ProfileDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public ProfileDtoBuilder education(String education) { this.education = education; return this; }
        public ProfileDtoBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public ProfileDtoBuilder targetRoleId(String targetRoleId) { this.targetRoleId = targetRoleId; return this; }
        public ProfileDtoBuilder targetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; return this; }
        public ProfileDtoBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ProfileDtoBuilder certificatesJson(String certificatesJson) { this.certificatesJson = certificatesJson; return this; }

        public ProfileDto build() {
            return new ProfileDto(id, userId, fullName, email, phone, education, experienceLevel, targetRoleId, targetRoleTitle, resumeUrl, certificatesJson);
        }
    }
}
