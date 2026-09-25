package com.skillbridge.portfolio.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import com.skillbridge.portfolio.dto.PortfolioDto;
import com.skillbridge.portfolio.dto.PortfolioUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final PortfolioProfileRepository portfolioRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final EvidenceRepository evidenceRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final ProjectProgressRepository projectProgressRepository;

    public PortfolioService(PortfolioProfileRepository portfolioRepository, StudentProfileRepository studentProfileRepository, StudentSkillRepository studentSkillRepository, EvidenceRepository evidenceRepository, AssessmentAttemptRepository attemptRepository, ProjectProgressRepository projectProgressRepository) {
        this.portfolioRepository = portfolioRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.evidenceRepository = evidenceRepository;
        this.attemptRepository = attemptRepository;
        this.projectProgressRepository = projectProgressRepository;
    }

    public PortfolioDto getStudentPortfolio(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        PortfolioProfile settings = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> {
                    String defaultUsername = profile.getEmail() != null ? profile.getEmail().split("@")[0] : "user" + userId;
                    PortfolioProfile newSettings = PortfolioProfile.builder()
                            .userId(userId)
                            .username(defaultUsername)
                            .bio("Aspiring Software & Backend Engineer passionate about clean architecture and skill excellence.")
                            .isPublic(true)
                            .shareToken(UUID.randomUUID().toString())
                            .build();
                    return portfolioRepository.save(newSettings);
                });

        List<StudentSkill> allSkills = studentSkillRepository.findByUserId(userId);
        List<StudentSkill> verifiedSkills = allSkills.stream()
                .filter(s -> s.getStatus() == SkillStatus.VERIFIED)
                .collect(Collectors.toList());

        List<Evidence> evidenceList = evidenceRepository.findByUserId(userId);
        List<AssessmentAttempt> attempts = attemptRepository.findByUserId(userId).stream()
                .filter(a -> Boolean.TRUE.equals(a.getPassed()))
                .collect(Collectors.toList());

        List<ProjectProgress> projects = projectProgressRepository.findByUserId(userId);

        return PortfolioDto.builder()
                .profile(profile)
                .portfolioSettings(settings)
                .verifiedSkills(verifiedSkills)
                .allSkills(allSkills)
                .evidenceList(evidenceList)
                .passedAssessments(attempts)
                .completedProjects(projects)
                .shareableUrl("http://localhost:5173/passport/" + settings.getUsername())
                .build();
    }

    public PortfolioDto getPublicPortfolio(String username) {
        if (username == null || username.trim().isEmpty()) {
            username = "student";
        }
        String searchUser = username.trim().toLowerCase();

        PortfolioProfile settings = portfolioRepository.findByUsername(searchUser)
                .orElseGet(() -> portfolioRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    PortfolioProfile p = PortfolioProfile.builder()
                            .userId(1L)
                            .username(searchUser)
                            .bio("Public Skill Passport Portfolio")
                            .isPublic(true)
                            .shareToken(UUID.randomUUID().toString())
                            .build();
                    return portfolioRepository.save(p);
                }));

        return getStudentPortfolio(settings.getUserId());
    }

    @Transactional
    public PortfolioDto updatePortfolioSettings(Long userId, PortfolioUpdateRequest request) {
        PortfolioProfile settings = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> PortfolioProfile.builder().userId(userId).build());

        if (request != null) {
            if (request.getBio() != null) settings.setBio(request.getBio());
            if (request.getIsPublic() != null) settings.setIsPublic(request.getIsPublic());
            if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
                settings.setUsername(request.getUsername().trim().toLowerCase());
            }
        }

        portfolioRepository.save(settings);
        return getStudentPortfolio(userId);
    }

    @Transactional
    public String generateShareLink(Long userId) {
        PortfolioProfile settings = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> PortfolioProfile.builder().userId(userId).username("user" + userId).build());

        settings.setShareToken(UUID.randomUUID().toString());
        settings.setIsPublic(true);
        portfolioRepository.save(settings);

        return "http://localhost:5173/passport/" + settings.getUsername() + "?token=" + settings.getShareToken();
    }
}
