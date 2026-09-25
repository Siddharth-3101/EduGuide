package com.skillbridge.career.controller;

import com.skillbridge.career.dto.CareerRoadmapDto;
import com.skillbridge.career.dto.TargetRoleRequest;
import com.skillbridge.career.service.CareerService;
import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.CareerCompetency;
import com.skillbridge.common.model.CareerRole;
import com.skillbridge.common.model.StudentProfile;
import com.skillbridge.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@Tag(name = "Career Intelligence Service", description = "Endpoints for discovering target roles, competencies, and career roadmaps")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @GetMapping
    @Operation(summary = "Get all available career roles")
    public ResponseEntity<ApiResponse<List<CareerRole>>> getCareers() {
        List<CareerRole> roles = careerService.getAllCareers();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @GetMapping("/{roleId}")
    @Operation(summary = "Get specific career role details")
    public ResponseEntity<ApiResponse<CareerRole>> getCareer(@PathVariable("roleId") String roleId) {
        CareerRole role = careerService.getCareerByRoleId(roleId);
        return ResponseEntity.ok(ApiResponse.success(role));
    }

    @GetMapping("/{roleId}/competencies")
    @Operation(summary = "Get required competencies for a target role")
    public ResponseEntity<ApiResponse<List<CareerCompetency>>> getCompetencies(@PathVariable("roleId") String roleId) {
        List<CareerCompetency> competencies = careerService.getCompetencies(roleId);
        return ResponseEntity.ok(ApiResponse.success(competencies));
    }

    @GetMapping("/{roleId}/roadmap")
    @Operation(summary = "Get structured career development roadmap")
    public ResponseEntity<ApiResponse<CareerRoadmapDto>> getRoadmap(@PathVariable("roleId") String roleId) {
        CareerRoadmapDto roadmap = careerService.getRoadmap(roleId);
        return ResponseEntity.ok(ApiResponse.success(roadmap));
    }

    @PostMapping("/target")
    @Operation(summary = "Set target career role for student profile")
    public ResponseEntity<ApiResponse<StudentProfile>> selectTargetRole(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody TargetRoleRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        StudentProfile updatedProfile = careerService.selectTargetRole(userId, request.getRoleId());
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Target role updated successfully"));
    }
}
