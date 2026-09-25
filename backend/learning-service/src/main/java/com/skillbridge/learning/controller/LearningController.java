package com.skillbridge.learning.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Course;
import com.skillbridge.common.model.LearningProgress;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.learning.dto.ProgressUpdateRequest;
import com.skillbridge.learning.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@Tag(name = "Learning Recommendation Service", description = "Endpoints for course discovery, skill gap learning recommendations, and progress tracking")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping
    @Operation(summary = "Get all available courses")
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        List<Course> courses = learningService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended courses based on student skill gaps")
    public ResponseEntity<ApiResponse<List<Course>>> getRecommendedCourses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Course> recommended = learningService.getRecommendedCourses(userId);
        return ResponseEntity.ok(ApiResponse.success(recommended));
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Get course details by ID")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable("courseId") Long courseId) {
        Course course = learningService.getCourseById(courseId);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @GetMapping("/skill/{skillId}")
    @Operation(summary = "Get courses for a specific skill")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesBySkillId(@PathVariable("skillId") String skillId) {
        List<Course> list = learningService.getCoursesBySkillId(skillId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{courseId}/progress")
    @Operation(summary = "Update learning progress for a course")
    public ResponseEntity<ApiResponse<LearningProgress>> updateProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("courseId") Long courseId,
            @RequestBody(required = false) ProgressUpdateRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        LearningProgress progress = learningService.updateProgress(userId, courseId, request);
        return ResponseEntity.ok(ApiResponse.success(progress, "Course progress updated"));
    }
}
