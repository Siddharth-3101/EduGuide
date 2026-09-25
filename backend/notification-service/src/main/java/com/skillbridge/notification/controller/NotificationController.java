package com.skillbridge.notification.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Notification;
import com.skillbridge.common.model.NotificationPreference;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification Service", description = "Endpoints for managing in-app notifications and email preferences")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Notification> list = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark specific notification as read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("id") Long id) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        Notification updated = notificationService.markAsRead(userId, id);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get notification preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> getPreferences(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        NotificationPreference preferences = notificationService.getPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update notification preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) NotificationPreference request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        NotificationPreference updated = notificationService.updatePreferences(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Preferences updated successfully"));
    }
}
