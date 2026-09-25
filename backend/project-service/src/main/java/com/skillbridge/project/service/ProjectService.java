package com.skillbridge.project.service;

import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.EvidenceType;
import com.skillbridge.common.model.enums.ProjectStatus;
import com.skillbridge.common.repository.*;
import com.skillbridge.common.service.abstractions.GitHubIntegrationService;
import com.skillbridge.project.dto.ProjectProgressRequest;
import com.skillbridge.project.dto.ProjectSubmissionRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectProgressRepository progressRepository;
    private final EvidenceRepository evidenceRepository;
    private final ActivityLogRepository activityLogRepository;
    private final GitHubIntegrationService gitHubIntegrationService;

    public ProjectService(ProjectRepository projectRepository, ProjectProgressRepository progressRepository, EvidenceRepository evidenceRepository, ActivityLogRepository activityLogRepository, GitHubIntegrationService gitHubIntegrationService) {
        this.projectRepository = projectRepository;
        this.progressRepository = progressRepository;
        this.evidenceRepository = evidenceRepository;
        this.activityLogRepository = activityLogRepository;
        this.gitHubIntegrationService = gitHubIntegrationService;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
    }

    public List<Project> getRecommendedProjects(Long userId) {
        return projectRepository.findAll();
    }

    @Transactional
    public ProjectProgress startProject(Long userId, Long projectId) {
        Project project = getProjectById(projectId);

        ProjectProgress progress = progressRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseGet(() -> ProjectProgress.builder()
                        .userId(userId)
                        .projectId(project.getId())
                        .status(ProjectStatus.IN_PROGRESS)
                        .progressPercent(10)
                        .build());

        progress.setStatus(ProjectStatus.IN_PROGRESS);
        progress = progressRepository.save(progress);

        ActivityLog log = ActivityLog.builder()
                .userId(userId)
                .activityType(com.skillbridge.common.model.enums.ActivityType.PROJECT_STARTED)
                .title("Project Started")
                .description("Started working on " + project.getTitle())
                .build();
        activityLogRepository.save(log);

        return progress;
    }

    @Transactional
    public ProjectProgress updateProgress(Long userId, Long projectId, ProjectProgressRequest request) {
        getProjectById(projectId);

        ProjectProgress progress = progressRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project session not initialized. Call /start first."));

        if (request != null) {
            if (request.getStatus() != null) progress.setStatus(request.getStatus());
            if (request.getProgressPercent() != null) progress.setProgressPercent(request.getProgressPercent());
            if (request.getGithubRepoUrl() != null) progress.setGithubRepoUrl(request.getGithubRepoUrl());
        }

        return progressRepository.save(progress);
    }

    @Transactional
    public ProjectProgress submitProject(Long userId, Long projectId, ProjectSubmissionRequest request) {
        Project project = getProjectById(projectId);

        if (!gitHubIntegrationService.validateRepositoryUrl(request.getGithubRepoUrl())) {
            throw new BadRequestException("Invalid GitHub repository URL format.");
        }

        GitHubIntegrationService.EvaluationResult eval = gitHubIntegrationService.evaluateSubmission(request.getGithubRepoUrl(), projectId);

        ProjectProgress progress = progressRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseGet(() -> ProjectProgress.builder()
                        .userId(userId)
                        .projectId(projectId)
                        .build());

        progress.setGithubRepoUrl(request.getGithubRepoUrl());
        progress.setSubmissionNotes(request.getSubmissionNotes());
        progress.setStatus(ProjectStatus.EVALUATED);
        progress.setProgressPercent(100);
        progress.setEvaluationScore(eval.getScore());
        progress.setFeedback(eval.getFeedback());

        progress = progressRepository.save(progress);

        Evidence evidence = Evidence.builder()
                .userId(userId)
                .name("Submitted Project: " + project.getTitle())
                .type(EvidenceType.PROJECT)
                .fileUrl(request.getGithubRepoUrl())
                .score(eval.getScore() + "%")
                .status("VERIFIED")
                .verifiedAt("Just now")
                .build();
        evidenceRepository.save(evidence);

        ActivityLog log = ActivityLog.builder()
                .userId(userId)
                .activityType(com.skillbridge.common.model.enums.ActivityType.PROJECT_SUBMITTED)
                .title("Project Evaluated")
                .description("Project '" + project.getTitle() + "' evaluated with score " + eval.getScore() + "%")
                .build();
        activityLogRepository.save(log);

        return progress;
    }

    public ProjectProgress getEvaluation(Long userId, Long projectId) {
        return progressRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("No evaluation found for project " + projectId));
    }
}
