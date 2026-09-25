package com.skillbridge.common.model;

import com.skillbridge.common.model.enums.EvidenceType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence")
public class Evidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String skillId;
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvidenceType type;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    private String verifiedAt;
    private String score;
    private String status;
    private LocalDateTime createdAt;

    public Evidence() {}

    public Evidence(Long id, Long userId, String skillId, String name, EvidenceType type, String fileUrl, String verifiedAt, String score, String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.skillId = skillId;
        this.name = name;
        this.type = type;
        this.fileUrl = fileUrl;
        this.verifiedAt = verifiedAt;
        this.score = score;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public EvidenceType getType() { return type; }
    public void setType(EvidenceType type) { this.type = type; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static EvidenceBuilder builder() { return new EvidenceBuilder(); }

    public static class EvidenceBuilder {
        private Long id;
        private Long userId;
        private String skillId;
        private String name;
        private EvidenceType type;
        private String fileUrl;
        private String verifiedAt;
        private String score;
        private String status;
        private LocalDateTime createdAt;

        public EvidenceBuilder id(Long id) { this.id = id; return this; }
        public EvidenceBuilder userId(Long userId) { this.userId = userId; return this; }
        public EvidenceBuilder skillId(String skillId) { this.skillId = skillId; return this; }
        public EvidenceBuilder name(String name) { this.name = name; return this; }
        public EvidenceBuilder type(EvidenceType type) { this.type = type; return this; }
        public EvidenceBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public EvidenceBuilder verifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; return this; }
        public EvidenceBuilder score(String score) { this.score = score; return this; }
        public EvidenceBuilder status(String status) { this.status = status; return this; }
        public EvidenceBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Evidence build() {
            return new Evidence(id, userId, skillId, name, type, fileUrl, verifiedAt, score, status, createdAt);
        }
    }
}
