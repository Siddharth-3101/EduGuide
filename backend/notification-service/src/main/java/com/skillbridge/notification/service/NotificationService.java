package com.skillbridge.notification.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Notification;
import com.skillbridge.common.model.NotificationPreference;
import com.skillbridge.common.repository.NotificationPreferenceRepository;
import com.skillbridge.common.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;

    public NotificationService(NotificationRepository notificationRepository, NotificationPreferenceRepository preferenceRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            Notification n1 = Notification.builder()
                    .userId(userId)
                    .title("Skill Verified")
                    .message("Your Java skill has been verified via assessment.")
                    .type("SKILL_VERIFICATION")
                    .readStatus(false)
                    .build();
            Notification n2 = Notification.builder()
                    .userId(userId)
                    .title("Assessment Ready")
                    .message("Your Docker Fundamentals assessment is ready.")
                    .type("ASSESSMENT")
                    .readStatus(false)
                    .build();
            notificationRepository.saveAll(Arrays.asList(n1, n2));
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return list;
    }

    @Transactional
    public Notification markAsRead(Long userId, Long notificationId) {
        List<Notification> userNotifs = getNotificationsForUser(userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseGet(() -> userNotifs.stream().findFirst().orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId)));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        list.forEach(n -> n.setReadStatus(true));
        notificationRepository.saveAll(list);
    }

    public NotificationPreference getPreferences(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(
                        NotificationPreference.builder()
                                .userId(userId)
                                .emailNotifications(true)
                                .inAppNotifications(true)
                                .jobAlerts(true)
                                .assessmentReminders(true)
                                .build()
                ));
    }

    @Transactional
    public NotificationPreference updatePreferences(Long userId, NotificationPreference request) {
        NotificationPreference pref = getPreferences(userId);
        if (request != null) {
            if (request.getEmailNotifications() != null) pref.setEmailNotifications(request.getEmailNotifications());
            if (request.getInAppNotifications() != null) pref.setInAppNotifications(request.getInAppNotifications());
            if (request.getJobAlerts() != null) pref.setJobAlerts(request.getJobAlerts());
            if (request.getAssessmentReminders() != null) pref.setAssessmentReminders(request.getAssessmentReminders());
        }
        return preferenceRepository.save(pref);
    }
}
