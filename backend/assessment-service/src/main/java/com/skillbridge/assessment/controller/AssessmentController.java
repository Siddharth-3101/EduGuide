package com.skillbridge.assessment.controller;

import com.skillbridge.assessment.dto.AssessmentResultDto;
import com.skillbridge.assessment.dto.AssessmentSubmissionRequest;
import com.skillbridge.assessment.service.AssessmentService;
import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Assessment;
import com.skillbridge.common.model.AssessmentAttempt;
import com.skillbridge.common.model.AssessmentQuestion;
import com.skillbridge.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
@Tag(name = "Assessment Service", description = "Endpoints for skill assessments, quiz sessions, submission evaluation, and skill verification")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    @Operation(summary = "Get all available skill assessments")
    public ResponseEntity<ApiResponse<List<Assessment>>> getAssessments() {
        List<Assessment> list = assessmentService.getAllAssessments();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific assessment details")
    public ResponseEntity<ApiResponse<Assessment>> getAssessmentById(@PathVariable("id") Long id) {
        Assessment assessment = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(ApiResponse.success(assessment));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start assessment test session")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startAssessment(@PathVariable("id") Long id) {
        Assessment assessment = assessmentService.getAssessmentById(id);
        List<AssessmentQuestion> questions = assessmentService.getQuestions(id);
        Map<String, Object> data = Map.of(
                "assessment", assessment,
                "questions", questions,
                "sessionStartedAt", System.currentTimeMillis()
        );
        return ResponseEntity.ok(ApiResponse.success(data, "Assessment session initialized"));
    }

    @GetMapping("/{id}/questions")
    @Operation(summary = "Get questions for an assessment")
    public ResponseEntity<ApiResponse<List<AssessmentQuestion>>> getQuestions(@PathVariable("id") Long id) {
        List<AssessmentQuestion> questions = assessmentService.getQuestions(id);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit assessment responses for score evaluation and skill verification")
    public ResponseEntity<ApiResponse<AssessmentResultDto>> submitAssessment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("id") Long id,
            @RequestBody(required = false) AssessmentSubmissionRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        AssessmentResultDto result = assessmentService.submitAssessment(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success(result, "Assessment submitted successfully"));
    }

    @GetMapping("/results/{resultId}")
    @Operation(summary = "Get detailed result for an assessment attempt")
    public ResponseEntity<ApiResponse<AssessmentAttempt>> getResult(@PathVariable("resultId") Long resultId) {
        AssessmentAttempt attempt = assessmentService.getAttemptResult(resultId);
        return ResponseEntity.ok(ApiResponse.success(attempt));
    }

    @GetMapping("/history")
    @Operation(summary = "Get student's historical assessment attempts")
    public ResponseEntity<ApiResponse<List<AssessmentAttempt>>> getHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<AssessmentAttempt> history = assessmentService.getHistory(userId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
