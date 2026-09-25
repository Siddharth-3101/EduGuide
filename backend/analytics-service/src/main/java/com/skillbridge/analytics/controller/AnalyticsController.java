package com.skillbridge.analytics.controller;

import com.skillbridge.analytics.dto.DashboardResponseDto;
import com.skillbridge.analytics.service.AnalyticsService;
import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.ActivityLog;
import com.skillbridge.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics Service", description = "Endpoints for aggregate dashboard data, competency progress, and student activity timeline")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get complete student dashboard metrics and overview data")
    public ResponseEntity<ApiResponse<DashboardResponseDto>> getDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        DashboardResponseDto dashboard = analyticsService.getDashboardData(userId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/activity")
    @Operation(summary = "Get student activity timeline log")
    public ResponseEntity<ApiResponse<List<ActivityLog>>> getActivityLogs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<ActivityLog> logs = analyticsService.getActivityLogs(userId);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/skill-progress")
    @Operation(summary = "Get skill competency growth metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSkillProgress(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        Map<String, Object> metrics = analyticsService.getSkillProgressMetrics(userId);
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/career-progress")
    @Operation(summary = "Get career competency coverage progress over time")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCareerProgress(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        Map<String, Object> metrics = analyticsService.getCareerProgressMetrics(userId);
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }
}
