package com.skillbridge.common.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private Boolean emailNotifications = true;
    private Boolean inAppNotifications = true;
    private Boolean jobAlerts = true;
    private Boolean assessmentReminders = true;

    public NotificationPreference() {}

    public NotificationPreference(Long id, Long userId, Boolean emailNotifications, Boolean inAppNotifications, Boolean jobAlerts, Boolean assessmentReminders) {
        this.id = id;
        this.userId = userId;
        this.emailNotifications = emailNotifications != null ? emailNotifications : true;
        this.inAppNotifications = inAppNotifications != null ? inAppNotifications : true;
        this.jobAlerts = jobAlerts != null ? jobAlerts : true;
        this.assessmentReminders = assessmentReminders != null ? assessmentReminders : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getInAppNotifications() { return inAppNotifications; }
    public void setInAppNotifications(Boolean inAppNotifications) { this.inAppNotifications = inAppNotifications; }

    public Boolean getJobAlerts() { return jobAlerts; }
    public void setJobAlerts(Boolean jobAlerts) { this.jobAlerts = jobAlerts; }

    public Boolean getAssessmentReminders() { return assessmentReminders; }
    public void setAssessmentReminders(Boolean assessmentReminders) { this.assessmentReminders = assessmentReminders; }

    public static NotificationPreferenceBuilder builder() { return new NotificationPreferenceBuilder(); }

    public static class NotificationPreferenceBuilder {
        private Long id;
        private Long userId;
        private Boolean emailNotifications = true;
        private Boolean inAppNotifications = true;
        private Boolean jobAlerts = true;
        private Boolean assessmentReminders = true;

        public NotificationPreferenceBuilder id(Long id) { this.id = id; return this; }
        public NotificationPreferenceBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationPreferenceBuilder emailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; return this; }
        public NotificationPreferenceBuilder inAppNotifications(Boolean inAppNotifications) { this.inAppNotifications = inAppNotifications; return this; }
        public NotificationPreferenceBuilder jobAlerts(Boolean jobAlerts) { this.jobAlerts = jobAlerts; return this; }
        public NotificationPreferenceBuilder assessmentReminders(Boolean assessmentReminders) { this.assessmentReminders = assessmentReminders; return this; }

        public NotificationPreference build() {
            return new NotificationPreference(id, userId, emailNotifications, inAppNotifications, jobAlerts, assessmentReminders);
        }
    }
}
