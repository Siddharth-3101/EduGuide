package com.skillbridge.common.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_profiles")
public class PortfolioProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Boolean isPublic = true;
    private String shareToken;
    private LocalDateTime createdAt;

    public PortfolioProfile() {}

    public PortfolioProfile(Long id, Long userId, String username, String bio, Boolean isPublic, String shareToken, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.bio = bio;
        this.isPublic = isPublic != null ? isPublic : true;
        this.shareToken = shareToken;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean public1) { isPublic = public1; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static PortfolioProfileBuilder builder() { return new PortfolioProfileBuilder(); }

    public static class PortfolioProfileBuilder {
        private Long id;
        private Long userId;
        private String username;
        private String bio;
        private Boolean isPublic = true;
        private String shareToken;
        private LocalDateTime createdAt;

        public PortfolioProfileBuilder id(Long id) { this.id = id; return this; }
        public PortfolioProfileBuilder userId(Long userId) { this.userId = userId; return this; }
        public PortfolioProfileBuilder username(String username) { this.username = username; return this; }
        public PortfolioProfileBuilder bio(String bio) { this.bio = bio; return this; }
        public PortfolioProfileBuilder isPublic(Boolean isPublic) { this.isPublic = isPublic; return this; }
        public PortfolioProfileBuilder shareToken(String shareToken) { this.shareToken = shareToken; return this; }
        public PortfolioProfileBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PortfolioProfile build() {
            return new PortfolioProfile(id, userId, username, bio, isPublic, shareToken, createdAt);
        }
    }
}
