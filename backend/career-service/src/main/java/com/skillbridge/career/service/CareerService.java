package com.skillbridge.career.service;

import com.skillbridge.career.dto.CareerRoadmapDto;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.CareerCompetency;
import com.skillbridge.common.model.CareerRole;
import com.skillbridge.common.model.StudentProfile;
import com.skillbridge.common.repository.CareerCompetencyRepository;
import com.skillbridge.common.repository.CareerRoleRepository;
import com.skillbridge.common.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CareerService {

    private final CareerRoleRepository careerRoleRepository;
    private final CareerCompetencyRepository careerCompetencyRepository;
    private final StudentProfileRepository studentProfileRepository;

    public CareerService(CareerRoleRepository careerRoleRepository, CareerCompetencyRepository careerCompetencyRepository, StudentProfileRepository studentProfileRepository) {
        this.careerRoleRepository = careerRoleRepository;
        this.careerCompetencyRepository = careerCompetencyRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    public List<CareerRole> getAllCareers() {
        return careerRoleRepository.findAll();
    }

    public CareerRole getCareerByRoleId(String roleId) {
        if (roleId == null || roleId.trim().isEmpty()) {
            roleId = "backend-developer";
        }
        String searchId = roleId.trim();
        Optional<CareerRole> opt = careerRoleRepository.findByRoleId(searchId);
        if (opt.isPresent()) {
            return opt.get();
        }
        try {
            Long numericId = Long.parseLong(searchId);
            List<CareerRole> all = careerRoleRepository.findAll();
            if (numericId > 0 && numericId <= all.size()) {
                return all.get((int) (numericId - 1));
            }
        } catch (NumberFormatException ignored) {}

        return careerRoleRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with roleId: " + searchId));
    }

    public List<CareerCompetency> getCompetencies(String roleId) {
        CareerRole role = getCareerByRoleId(roleId);
        return careerCompetencyRepository.findByRoleId(role.getRoleId());
    }

    public CareerRoadmapDto getRoadmap(String roleId) {
        CareerRole role = getCareerByRoleId(roleId);
        List<CareerCompetency> competencies = getCompetencies(role.getRoleId());

        List<CareerRoadmapDto.RoadmapStage> stages = Arrays.asList(
                CareerRoadmapDto.RoadmapStage.builder()
                        .stageName("Phase 1: Core Foundations")
                        .description("Master basic programming syntax, version control, and database fundamentals.")
                        .skills(Arrays.asList("Java", "Python", "Git", "SQL"))
                        .estimatedDuration("4–6 weeks")
                        .build(),
                CareerRoadmapDto.RoadmapStage.builder()
                        .stageName("Phase 2: Frameworks & API Architecture")
                        .description("Build modular REST APIs, master Spring Boot, and integrate ORM persistence.")
                        .skills(Arrays.asList("Spring Boot", "REST API", "MySQL", "PostgreSQL"))
                        .estimatedDuration("6–8 weeks")
                        .build(),
                CareerRoadmapDto.RoadmapStage.builder()
                        .stageName("Phase 3: Containerization & Cloud Readiness")
                        .description("Containerize services with Docker and deploy microservices to cloud environments.")
                        .skills(Arrays.asList("Docker", "AWS", "Cybersecurity"))
                        .estimatedDuration("4–6 weeks")
                        .build()
        );

        return CareerRoadmapDto.builder()
                .role(role)
                .competencies(competencies)
                .stages(stages)
                .build();
    }

    public StudentProfile selectTargetRole(Long userId, String roleId) {
        CareerRole role = getCareerByRoleId(roleId);

        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> StudentProfile.builder()
                        .userId(userId)
                        .build());

        profile.setTargetRoleId(role.getRoleId());
        profile.setTargetRoleTitle(role.getTitle());

        return studentProfileRepository.save(profile);
    }
}
