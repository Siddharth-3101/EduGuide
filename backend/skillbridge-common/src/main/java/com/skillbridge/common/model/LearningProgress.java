package com.skillbridge.common.model;

import com.skillbridge.common.model.enums.LearningStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress")
public class LearningProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long courseId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LearningStatus status;

    private Integer progressPercent = 0;
    private LocalDateTime lastAccessedAt;

    public LearningProgress() {}

    public LearningProgress(Long id, Long userId, Long courseId, LearningStatus status, Integer progressPercent, LocalDateTime lastAccessedAt) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.status = status;
        this.progressPercent = progressPercent != null ? progressPercent : 0;
        this.lastAccessedAt = lastAccessedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LearningStatus getStatus() { return status; }
    public void setStatus(LearningStatus status) { this.status = status; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }
    public void setLastAccessedAt(LocalDateTime lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastAccessedAt = LocalDateTime.now();
    }

    public static LearningProgressBuilder builder() { return new LearningProgressBuilder(); }

    public static class LearningProgressBuilder {
        private Long id;
        private Long userId;
        private Long courseId;
        private LearningStatus status;
        private Integer progressPercent = 0;
        private LocalDateTime lastAccessedAt;

        public LearningProgressBuilder id(Long id) { this.id = id; return this; }
        public LearningProgressBuilder userId(Long userId) { this.userId = userId; return this; }
        public LearningProgressBuilder courseId(Long courseId) { this.courseId = courseId; return this; }
        public LearningProgressBuilder status(LearningStatus status) { this.status = status; return this; }
        public LearningProgressBuilder progressPercent(Integer progressPercent) { this.progressPercent = progressPercent; return this; }
        public LearningProgressBuilder lastAccessedAt(LocalDateTime lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; return this; }

        public LearningProgress build() {
            return new LearningProgress(id, userId, courseId, status, progressPercent, lastAccessedAt);
        }
    }
}
