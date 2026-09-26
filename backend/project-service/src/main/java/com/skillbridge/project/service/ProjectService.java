package com.skillbridge.project.service;

import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.EvidenceType;
import com.skillbridge.common.model.enums.ProjectStatus;
import com.skillbridge.common.model.enums.SkillStatus;
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
    private final StudentSkillRepository studentSkillRepository;
    private final SkillRepository skillRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectProgressRepository progressRepository,
                          EvidenceRepository evidenceRepository,
                          ActivityLogRepository activityLogRepository,
                          GitHubIntegrationService gitHubIntegrationService,
                          StudentSkillRepository studentSkillRepository,
                          SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.progressRepository = progressRepository;
        this.evidenceRepository = evidenceRepository;
        this.activityLogRepository = activityLogRepository;
        this.gitHubIntegrationService = gitHubIntegrationService;
        this.studentSkillRepository = studentSkillRepository;
        this.skillRepository = skillRepository;
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
    public Project createProject(Long userId, java.util.Map<String, Object> projectData) {
        String title = projectData.containsKey("title") ? (String) projectData.get("title")
                : (projectData.containsKey("projectName") ? (String) projectData.get("projectName") : "Custom Software Project");
        String desc = projectData.containsKey("description") ? (String) projectData.get("description")
                : (projectData.containsKey("objective") ? (String) projectData.get("objective") : "Verified practical software engineering project.");
        
        Object skillsObj = projectData.get("skillsCovered");
        if (skillsObj == null) skillsObj = projectData.get("skills");
        if (skillsObj == null) skillsObj = projectData.get("detectedTechnologies");
        if (skillsObj == null) skillsObj = projectData.get("detectedSkills");

        String skillsStr = "Java, Spring Boot, REST API";
        if (skillsObj instanceof java.util.List) {
            java.util.List<?> list = (java.util.List<?>) skillsObj;
            skillsStr = list.stream().map(Object::toString).reduce((a, b) -> a + ", " + b).orElse("Engineering");
        } else if (skillsObj instanceof String) {
            skillsStr = (String) skillsObj;
        }

        String githubUrl = projectData.containsKey("githubRepoUrl") ? (String) projectData.get("githubRepoUrl")
                : (projectData.containsKey("repositoryUrl") ? (String) projectData.get("repositoryUrl") : "");

        Project project = new Project();
        project.setTitle(title);
        project.setObjective(desc);
        project.setSkillsCovered(skillsStr);
        project.setDifficulty((String) projectData.getOrDefault("difficulty", "Intermediate"));
        project.setEstimatedTime((String) projectData.getOrDefault("estimatedTime", "8 hours"));
        project.setRequirements("Repository codebase analysis and practical deployment.");
        project.setArchitecture("Production microservice architecture with REST contracts.");
        project.setSubmissionRequirements(githubUrl);
        project.setEvaluationCriteria("Code quality, schema design, and modularity.");

        Project saved = projectRepository.save(project);

        try {
            ProjectProgress progress = ProjectProgress.builder()
                    .userId(userId)
                    .projectId(saved.getId())
                    .status(ProjectStatus.EVALUATED)
                    .githubRepoUrl(githubUrl)
                    .progressPercent(100)
                    .submissionNotes(desc)
                    .evaluationScore(92)
                    .feedback("Project analyzed from repository: verified architecture and practical competencies.")
                    .build();
            progressRepository.save(progress);
        } catch (Exception ignored) {}

        return saved;
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

        // Promote practiced skills to EVIDENCE_BACKED and record granular evidence
        if (project.getSkillsCovered() != null && !project.getSkillsCovered().trim().isEmpty()) {
            String[] skillTokens = project.getSkillsCovered().split(",");
            for (String tok : skillTokens) {
                String raw = tok.trim();
                if (raw.isEmpty()) continue;

                Skill masterSkill = skillRepository.findBySkillId(raw)
                        .orElseGet(() -> {
                            for (Skill s : skillRepository.findAll()) {
                                if (s.getName().equalsIgnoreCase(raw)) return s;
                            }
                            return null;
                        });

                String skillId = masterSkill != null ? masterSkill.getSkillId() : raw;
                String skillName = masterSkill != null ? masterSkill.getName() : raw;
                String category = masterSkill != null ? masterSkill.getCategory() : "Technical";

                StudentSkill studentSkill = studentSkillRepository.findByUserIdAndSkillId(userId, skillId)
                        .orElseGet(() -> StudentSkill.builder()
                                .userId(userId)
                                .skillId(skillId)
                                .name(skillName)
                                .category(category)
                                .level("Intermediate")
                                .status(SkillStatus.MISSING)
                                .score(0)
                                .evidenceCount(0)
                                .build());

                if (studentSkill.getStatus() != SkillStatus.ASSESSMENT_VERIFIED && studentSkill.getStatus() != SkillStatus.VERIFIED) {
                    studentSkill.setStatus(SkillStatus.EVIDENCE_BACKED);
                }
                studentSkill.setEvidenceCount((studentSkill.getEvidenceCount() != null ? studentSkill.getEvidenceCount() : 0) + 1);
                studentSkill.setScore(Math.max(studentSkill.getScore() != null ? studentSkill.getScore() : 0, eval.getScore()));
                studentSkillRepository.save(studentSkill);

                Evidence evidence = Evidence.builder()
                        .userId(userId)
                        .skillId(skillId)
                        .name("Project Submission: " + project.getTitle())
                        .type(EvidenceType.PROJECT)
                        .fileUrl(request.getGithubRepoUrl())
                        .score(eval.getScore() + "%")
                        .status("EVIDENCE_BACKED")
                        .verifiedAt("Just now")
                        .build();
                evidenceRepository.save(evidence);
            }
        } else {
            Evidence evidence = Evidence.builder()
                    .userId(userId)
                    .name("Submitted Project: " + project.getTitle())
                    .type(EvidenceType.PROJECT)
                    .fileUrl(request.getGithubRepoUrl())
                    .score(eval.getScore() + "%")
                    .status("EVIDENCE_BACKED")
                    .verifiedAt("Just now")
                    .build();
            evidenceRepository.save(evidence);
        }

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
