package com.skillbridge.portfolio.controller;

import com.skillbridge.common.dto.ApiResponse;
import com.skillbridge.common.security.UserPrincipal;
import com.skillbridge.portfolio.dto.PortfolioDto;
import com.skillbridge.portfolio.dto.PortfolioUpdateRequest;
import com.skillbridge.portfolio.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@Tag(name = "Portfolio / Skill Passport Service", description = "Endpoints for generating public Skill Passport profiles, sharing verified credentials, and portfolio management")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    @Operation(summary = "Get authenticated student's full Skill Passport portfolio")
    public ResponseEntity<ApiResponse<PortfolioDto>> getPortfolio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        PortfolioDto portfolio = portfolioService.getStudentPortfolio(userId);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    @GetMapping("/public/{username}")
    @Operation(summary = "Get public Skill Passport by student username")
    public ResponseEntity<ApiResponse<PortfolioDto>> getPublicPortfolio(@PathVariable("username") String username) {
        PortfolioDto portfolio = portfolioService.getPublicPortfolio(username);
        return ResponseEntity.ok(ApiResponse.success(portfolio));
    }

    @PutMapping
    @Operation(summary = "Update portfolio bio and visibility settings")
    public ResponseEntity<ApiResponse<PortfolioDto>> updatePortfolio(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) PortfolioUpdateRequest request) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        PortfolioDto updated = portfolioService.updatePortfolioSettings(userId, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Portfolio updated successfully"));
    }

    @PostMapping("/share")
    @Operation(summary = "Generate shareable public link for Skill Passport")
    public ResponseEntity<ApiResponse<Map<String, String>>> sharePortfolio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : 1L;
        String shareUrl = portfolioService.generateShareLink(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("shareableUrl", shareUrl), "Share link generated successfully"));
    }
}
