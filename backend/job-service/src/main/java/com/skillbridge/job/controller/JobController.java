package com.skillbridge.job.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Job;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.job.dto.JobMatchDto;
import com.skillbridge.job.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job Service", description = "Endpoints for job postings discovery, skill matching, and competency alignment metrics")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Get all job listings")
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get recommended jobs with competency match calculation")
    public ResponseEntity<ApiResponse<List<JobMatchDto>>> getRecommendedJobs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<JobMatchDto> recommended = jobService.getRecommendedJobs(userId);
        return ResponseEntity.ok(ApiResponse.success(recommended));
    }

    @GetMapping("/{jobId}")
    @Operation(summary = "Get job details by ID")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable("jobId") Long jobId) {
        Job job = jobService.getJobById(jobId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/{jobId}/match")
    @Operation(summary = "Calculate student competency match percentage for a job posting")
    public ResponseEntity<ApiResponse<JobMatchDto>> getJobMatch(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("jobId") Long jobId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        JobMatchDto match = jobService.calculateJobMatch(userId, jobId);
        return ResponseEntity.ok(ApiResponse.success(match));
    }

    @GetMapping("/filters")
    @Operation(summary = "Get available job search filter options")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFilters() {
        Map<String, Object> filters = jobService.getFilters();
        return ResponseEntity.ok(ApiResponse.success(filters));
    }
}
