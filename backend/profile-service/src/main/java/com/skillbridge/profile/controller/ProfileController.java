package com.skillbridge.profile.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Evidence;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.profile.dto.ProfileDto;
import com.skillbridge.profile.dto.ProfileUpdateRequest;
import com.skillbridge.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile Service", description = "Endpoints for managing student profile, resume uploads, and certificates")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "Get authenticated student profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    @Operation(summary = "Update student profile information")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ProfileUpdateRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        ProfileDto updated = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }

    @PostMapping("/resume")
    @Operation(summary = "Upload resume for skill extraction and evidence verification")
    public ResponseEntity<ApiResponse<Evidence>> uploadResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestBody(required = false) Map<String, String> body) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        String fileName = file != null ? file.getOriginalFilename() : (body != null ? body.getOrDefault("name", "resume.pdf") : "resume.pdf");
        String fileUrl = body != null ? body.get("url") : null;
        byte[] content = file != null ? getBytes(file) : new byte[0];

        Evidence evidence = profileService.addResumeEvidence(userId, fileName, fileUrl, content);
        return ResponseEntity.ok(ApiResponse.success(evidence, "Resume uploaded and skills extracted"));
    }

    @PostMapping("/certificates")
    @Operation(summary = "Upload certificate for skill verification")
    public ResponseEntity<ApiResponse<Evidence>> uploadCertificate(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestBody(required = false) Map<String, String> body) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        String fileName = file != null ? file.getOriginalFilename() : (body != null ? body.getOrDefault("name", "certificate.pdf") : "certificate.pdf");
        String fileUrl = body != null ? body.get("url") : null;

        Evidence evidence = profileService.addCertificateEvidence(userId, fileName, fileUrl);
        return ResponseEntity.ok(ApiResponse.success(evidence, "Certificate evidence recorded"));
    }

    @GetMapping("/evidence")
    @Operation(summary = "Get list of evidence items for student profile")
    public ResponseEntity<ApiResponse<List<Evidence>>> getEvidence(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<Evidence> list = profileService.getUserEvidence(userId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/evidence/{id}")
    @Operation(summary = "Delete an evidence item")
    public ResponseEntity<ApiResponse<String>> deleteEvidence(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("id") Long id) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        profileService.deleteEvidence(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Evidence deleted successfully"));
    }

    private byte[] getBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (Exception e) {
            return new byte[0];
        }
    }
}
