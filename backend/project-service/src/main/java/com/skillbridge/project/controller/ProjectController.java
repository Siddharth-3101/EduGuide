package com.skillbridge.project.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Project;
import com.skillbridge.common.model.ProjectProgress;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.project.dto.ProjectProgressRequest;
import com.skillbridge.project.dto.ProjectSubmissionRequest;
import com.skillbridge.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Service", description = "Endpoints for project discovery, GitHub repository submission, and automated evaluation")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Get all practical projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> list = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended projects based on competency gaps")
    public ResponseEntity<ApiResponse<List<Project>>> getRecommendedProjects(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Project> list = projectService.getRecommendedProjects(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable("projectId") Long projectId) {
        Project project = projectService.getProjectById(projectId);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping("/{projectId}/start")
    @Operation(summary = "Start working on a project")
    public ResponseEntity<ApiResponse<ProjectProgress>> startProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("projectId") Long projectId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProjectProgress progress = projectService.startProject(userId, projectId);
        return ResponseEntity.ok(ApiResponse.success(progress, "Project started successfully"));
    }

    @PutMapping("/{projectId}/progress")
    @Operation(summary = "Update project completion progress")
    public ResponseEntity<ApiResponse<ProjectProgress>> updateProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("projectId") Long projectId,
            @RequestBody(required = false) ProjectProgressRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProjectProgress progress = projectService.updateProgress(userId, projectId, request);
        return ResponseEntity.ok(ApiResponse.success(progress, "Project progress updated"));
    }

    @PostMapping("/{projectId}/submit")
    @Operation(summary = "Submit GitHub repository URL for project evaluation")
    public ResponseEntity<ApiResponse<ProjectProgress>> submitProject(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("projectId") Long projectId,
            @Valid @RequestBody ProjectSubmissionRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProjectProgress progress = projectService.submitProject(userId, projectId, request);
        return ResponseEntity.ok(ApiResponse.success(progress, "Project submitted and evaluated successfully"));
    }

    @GetMapping("/{projectId}/evaluation")
    @Operation(summary = "Get project evaluation feedback")
    public ResponseEntity<ApiResponse<ProjectProgress>> getEvaluation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("projectId") Long projectId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProjectProgress progress = projectService.getEvaluation(userId, projectId);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }
}
