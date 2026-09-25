package com.skillbridge.skill.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.model.Skill;
import com.skillbridge.common.model.StudentSkill;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.skill.dto.VerifySkillRequest;
import com.skillbridge.skill.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skill Service", description = "Endpoints for discovering skills, categories, student skills, and verifying skill competencies")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    @Operation(summary = "Get all available master skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search) {
        List<Skill> skills = skillService.searchSkills(search, category);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get skill categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = skillService.getCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/search")
    @Operation(summary = "Search skills by query and category")
    public ResponseEntity<ApiResponse<List<Skill>>> searchSkills(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "category", required = false) String category) {
        List<Skill> skills = skillService.searchSkills(query, category);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/{skillId}")
    @Operation(summary = "Get skill details by skillId")
    public ResponseEntity<ApiResponse<Skill>> getSkillById(@PathVariable("skillId") String skillId) {
        Skill skill = skillService.getSkillBySkillId(skillId);
        return ResponseEntity.ok(ApiResponse.success(skill));
    }

    @GetMapping("/student")
    @Operation(summary = "Get authenticated student skills profile")
    public ResponseEntity<ApiResponse<List<StudentSkill>>> getStudentSkills(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        List<StudentSkill> skills = skillService.getStudentSkills(userId);
        return ResponseEntity.ok(ApiResponse.success(skills));
    }

    @GetMapping("/student/{skillId}")
    @Operation(summary = "Get student skill status for a specific skill")
    public ResponseEntity<ApiResponse<StudentSkill>> getStudentSkillById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("skillId") String skillId) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        StudentSkill studentSkill = skillService.getStudentSkillBySkillId(userId, skillId);
        return ResponseEntity.ok(ApiResponse.success(studentSkill));
    }

    @PostMapping("/{skillId}/verify")
    @Operation(summary = "Verify student skill competency")
    public ResponseEntity<ApiResponse<StudentSkill>> verifySkill(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("skillId") String skillId,
            @RequestBody(required = false) VerifySkillRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        StudentSkill verified = skillService.verifySkill(userId, skillId, request);
        return ResponseEntity.ok(ApiResponse.success(verified, "Skill verified successfully"));
    }
}
