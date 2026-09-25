package com.skillbridge.readiness.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Course;
import com.skillbridge.common.model.Project;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.readiness.dto.CareerReadinessDto;
import com.skillbridge.readiness.dto.NextActionDto;
import com.skillbridge.readiness.dto.SkillGapDto;
import com.skillbridge.readiness.service.ReadinessEngineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/readiness")
@Tag(name = "Career Readiness & Skill Gap Engine", description = "Core intelligence service evaluating competency coverage, skill gaps, priority levels, and next best action")
public class ReadinessController {

    private final ReadinessEngineService readinessEngineService;

    public ReadinessController(ReadinessEngineService readinessEngineService) {
        this.readinessEngineService = readinessEngineService;
    }


    @GetMapping
    @Operation(summary = "Get complete career readiness analysis for target role")
    public ResponseEntity<ApiResponse<CareerReadinessDto>> getReadiness(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        CareerReadinessDto dto = readinessEngineService.calculateReadiness(userId, null);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/role/{roleId}")
    @Operation(summary = "Get career readiness analysis for a specific role")
    public ResponseEntity<ApiResponse<CareerReadinessDto>> getReadinessForRole(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("roleId") String roleId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        CareerReadinessDto dto = readinessEngineService.calculateReadiness(userId, roleId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/skills")
    @Operation(summary = "Get competency breakdown by verified, partial, and missing status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSkillsBreakdown(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        CareerReadinessDto dto = readinessEngineService.calculateReadiness(userId, null);
        Map<String, Object> data = Map.of(
                "verifiedSkills", dto.getVerifiedSkills(),
                "partialSkills", dto.getPartialSkills(),
                "missingSkills", dto.getMissingSkills()
        );
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/gaps")
    @Operation(summary = "Get prioritized skill gap analysis")
    public ResponseEntity<ApiResponse<List<SkillGapDto>>> getGaps(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<SkillGapDto> gaps = readinessEngineService.getSkillGaps(userId);
        return ResponseEntity.ok(ApiResponse.success(gaps));
    }

    @GetMapping("/next-action")
    @Operation(summary = "Calculate student's Next Best Action")
    public ResponseEntity<ApiResponse<NextActionDto>> getNextAction(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        NextActionDto action = readinessEngineService.getNextBestAction(userId);
        return ResponseEntity.ok(ApiResponse.success(action));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get learning & project recommendations aligned with skill gaps")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        CareerReadinessDto dto = readinessEngineService.calculateReadiness(userId, null);
        Map<String, Object> recs = Map.of(
                "learning", dto.getLearningRecommendations(),
                "projects", dto.getProjectRecommendations()
        );
        return ResponseEntity.ok(ApiResponse.success(recs));
    }
}
