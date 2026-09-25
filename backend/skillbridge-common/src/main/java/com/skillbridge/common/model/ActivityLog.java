package com.skillbridge.common.model;

import com.skillbridge.common.model.enums.ActivityType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType activityType;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    public ActivityLog() {}

    public ActivityLog(Long id, Long userId, ActivityType activityType, String title, String description, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.activityType = activityType;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static ActivityLogBuilder builder() { return new ActivityLogBuilder(); }

    public static class ActivityLogBuilder {
        private Long id;
        private Long userId;
        private ActivityType activityType;
        private String title;
        private String description;
        private LocalDateTime createdAt;

        public ActivityLogBuilder id(Long id) { this.id = id; return this; }
        public ActivityLogBuilder userId(Long userId) { this.userId = userId; return this; }
        public ActivityLogBuilder activityType(ActivityType activityType) { this.activityType = activityType; return this; }
        public ActivityLogBuilder title(String title) { this.title = title; return this; }
        public ActivityLogBuilder description(String description) { this.description = description; return this; }
        public ActivityLogBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ActivityLog build() {
            return new ActivityLog(id, userId, activityType, title, description, createdAt);
        }
    }
}
