package com.skillbridge.common.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private String fullName;
    private String email;
    private String phone;
    private String education;
    private String experienceLevel;

    private String targetRoleId;
    private String targetRoleTitle;

    @Column(columnDefinition = "TEXT")
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String certificatesJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentProfile() {}

    public StudentProfile(Long id, Long userId, String fullName, String email, String phone, String education, String experienceLevel, String targetRoleId, String targetRoleTitle, String resumeUrl, String certificatesJson, LocalDateTime createdAt, LocalDateTime updatedAt) {
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static StudentProfileBuilder builder() { return new StudentProfileBuilder(); }

    public static class StudentProfileBuilder {
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
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public StudentProfileBuilder id(Long id) { this.id = id; return this; }
        public StudentProfileBuilder userId(Long userId) { this.userId = userId; return this; }
        public StudentProfileBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public StudentProfileBuilder email(String email) { this.email = email; return this; }
        public StudentProfileBuilder phone(String phone) { this.phone = phone; return this; }
        public StudentProfileBuilder education(String education) { this.education = education; return this; }
        public StudentProfileBuilder experienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; return this; }
        public StudentProfileBuilder targetRoleId(String targetRoleId) { this.targetRoleId = targetRoleId; return this; }
        public StudentProfileBuilder targetRoleTitle(String targetRoleTitle) { this.targetRoleTitle = targetRoleTitle; return this; }
        public StudentProfileBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public StudentProfileBuilder certificatesJson(String certificatesJson) { this.certificatesJson = certificatesJson; return this; }
        public StudentProfileBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StudentProfileBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public StudentProfile build() {
            return new StudentProfile(id, userId, fullName, email, phone, education, experienceLevel, targetRoleId, targetRoleTitle, resumeUrl, certificatesJson, createdAt, updatedAt);
        }
    }
}
