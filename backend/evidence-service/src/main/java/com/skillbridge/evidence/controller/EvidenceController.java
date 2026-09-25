package com.skillbridge.evidence.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Evidence;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.evidence.dto.CreateEvidenceRequest;
import com.skillbridge.evidence.service.EvidenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@Tag(name = "Evidence & Verification Service", description = "Endpoints for managing student evidence items and skill verification records")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping
    @Operation(summary = "Record a new evidence item")
    public ResponseEntity<ApiResponse<Evidence>> addEvidence(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateEvidenceRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        Evidence evidence = evidenceService.addEvidence(userId, request);
        return ResponseEntity.ok(ApiResponse.success(evidence, "Evidence recorded successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all evidence items for authenticated student")
    public ResponseEntity<ApiResponse<List<Evidence>>> getEvidence(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Evidence> list = evidenceService.getEvidenceForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific evidence by ID")
    public ResponseEntity<ApiResponse<Evidence>> getEvidenceById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("id") Long id) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        Evidence evidence = evidenceService.getEvidenceById(userId, id);
        return ResponseEntity.ok(ApiResponse.success(evidence));
    }

    @GetMapping("/skill/{skillId}")
    @Operation(summary = "Get evidence items for a specific skill")
    public ResponseEntity<ApiResponse<List<Evidence>>> getEvidenceBySkillId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("skillId") String skillId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Evidence> list = evidenceService.getEvidenceBySkillId(userId, skillId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an evidence item")
    public ResponseEntity<ApiResponse<String>> deleteEvidence(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("id") Long id) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        evidenceService.deleteEvidence(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Evidence deleted successfully"));
    }
}
