package com.skillbridge.career.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.career.dto.CareerRoadmapDto;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CareerService {

    private final CareerRoleRepository careerRoleRepository;
    private final CareerCompetencyRepository careerCompetencyRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PathwayRepository pathwayRepository;
    private final RoadmapStageRepository roadmapStageRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ObjectMapper objectMapper;

    public CareerService(CareerRoleRepository careerRoleRepository,
                         CareerCompetencyRepository careerCompetencyRepository,
                         StudentProfileRepository studentProfileRepository,
                         PathwayRepository pathwayRepository,
                         RoadmapStageRepository roadmapStageRepository,
                         StudentSkillRepository studentSkillRepository,
                         ObjectMapper objectMapper) {
        this.careerRoleRepository = careerRoleRepository;
        this.careerCompetencyRepository = careerCompetencyRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.pathwayRepository = pathwayRepository;
        this.roadmapStageRepository = roadmapStageRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.objectMapper = objectMapper;
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
        for (CareerRole r : careerRoleRepository.findAll()) {
            if (r.getRoleId().equalsIgnoreCase(searchId) ||
                (r.getCareerDomainId() != null && r.getCareerDomainId().equalsIgnoreCase(searchId))) {
                return r;
            }
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

    public List<Pathway> getPathways(String roleId) {
        CareerRole role = getCareerByRoleId(roleId);
        List<Pathway> list = pathwayRepository.findByCareerRoleId(role.getRoleId());
        if (list.isEmpty() && role.getCareerDomainId() != null) {
            list = pathwayRepository.findByCareerRoleId(role.getCareerDomainId());
        }
        return list;
    }

    public CareerRoadmapDto getRoadmap(String roleId) {
        return getRoadmap(roleId, null);
    }

    public CareerRoadmapDto getRoadmap(String roleId, String pathwayId) {
        CareerRole role = getCareerByRoleId(roleId);
        List<CareerCompetency> competencies = getCompetencies(role.getRoleId());

        List<Pathway> pathways = getPathways(role.getRoleId());
        Pathway selectedPathway = null;
        if (pathwayId != null && !pathwayId.trim().isEmpty()) {
            selectedPathway = pathways.stream()
                    .filter(p -> p.getId().equalsIgnoreCase(pathwayId.trim()))
                    .findFirst()
                    .orElse(null);
        }
        if (selectedPathway == null && !pathways.isEmpty()) {
            selectedPathway = pathways.get(0);
        }

        List<CareerRoadmapDto.RoadmapStage> stages = new ArrayList<>();
        if (selectedPathway != null) {
            List<RoadmapStage> dbStages = roadmapStageRepository.findByPathwayIdOrderByStageNumberAsc(selectedPathway.getId());
            for (RoadmapStage rs : dbStages) {
                List<String> skillsList = parseSkillsJson(rs.getSkillsJson());
                stages.add(CareerRoadmapDto.RoadmapStage.builder()
                        .stageName("Stage " + rs.getStageNumber() + ": " + rs.getStageName())
                        .description(rs.getDescription())
                        .estimatedDuration(rs.getEstimatedDuration() != null ? rs.getEstimatedDuration() : "4–6 weeks")
                        .skills(skillsList)
                        .build());
            }
        }

        if (stages.isEmpty()) {
            // Graceful fallback baseline stages
            stages = Arrays.asList(
                    CareerRoadmapDto.RoadmapStage.builder()
                            .stageName("Phase 1: Core Foundations")
                            .description("Master basic programming syntax, version control, and database fundamentals.")
                            .skills(Arrays.asList("Java", "Python", "Git", "SQL"))
                            .estimatedDuration("4–6 weeks")
                            .build(),
                    CareerRoadmapDto.RoadmapStage.builder()
                            .stageName("Phase 2: Frameworks & API Architecture")
                            .description("Build modular REST APIs, master frameworks, and integrate persistence.")
                            .skills(Arrays.asList("Spring Boot", "REST API", "PostgreSQL"))
                            .estimatedDuration("6–8 weeks")
                            .build(),
                    CareerRoadmapDto.RoadmapStage.builder()
                            .stageName("Phase 3: Containerization & Cloud Readiness")
                            .description("Containerize services with Docker and deploy to cloud environments.")
                            .skills(Arrays.asList("Docker", "AWS"))
                            .estimatedDuration("4–6 weeks")
                            .build()
            );
        }

        return CareerRoadmapDto.builder()
                .role(role)
                .competencies(competencies)
                .stages(stages)
                .build();
    }

    public Map<String, Object> getRoadmapGraph(String roleId, String pathwayId, Long userId) {
        CareerRole role = getCareerByRoleId(roleId);
        List<Pathway> pathways = getPathways(role.getRoleId());
        Pathway selectedPathway = null;
        if (pathwayId != null && !pathwayId.trim().isEmpty()) {
            selectedPathway = pathways.stream()
                    .filter(p -> p.getId().equalsIgnoreCase(pathwayId.trim()))
                    .findFirst()
                    .orElse(null);
        }
        if (selectedPathway == null && !pathways.isEmpty()) {
            selectedPathway = pathways.get(0);
        }

        List<RoadmapStage> dbStages = selectedPathway != null ?
                roadmapStageRepository.findByPathwayIdOrderByStageNumberAsc(selectedPathway.getId()) :
                Collections.emptyList();

        List<StudentSkill> studentSkills = userId != null ?
                studentSkillRepository.findByUserId(userId) : Collections.emptyList();

        Map<String, String> statusMap = new HashMap<>();
        for (StudentSkill ss : studentSkills) {
            String sId = ss.getSkillId() != null ? ss.getSkillId().toLowerCase() : "";
            String sName = ss.getName() != null ? ss.getName().toLowerCase() : "";
            String st = ss.getStatus() != null ? ss.getStatus().name().toLowerCase() : "missing";
            statusMap.put(sId, st);
            statusMap.put(sName, st);
        }

        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();

        // Root Node
        Map<String, Object> rootNode = new HashMap<>();
        rootNode.put("id", "node-root");
        rootNode.put("type", "targetCareerNode");
        rootNode.put("position", Map.of("x", 40, "y", 200));
        rootNode.put("data", Map.of(
                "label", role.getTitle(),
                "roleTitle", role.getTitle(),
                "category", role.getCategory() != null ? role.getCategory() : "Target Career",
                "isRoot", true
        ));
        nodes.add(rootNode);

        int verifiedCount = 0;
        int partialCount = 0;
        int missingCount = 0;

        List<String> prevStageNodeIds = new ArrayList<>();
        prevStageNodeIds.add("node-root");

        for (int sIdx = 0; sIdx < dbStages.size(); sIdx++) {
            RoadmapStage stage = dbStages.get(sIdx);
            int stageNum = sIdx + 1;
            List<String> skills = parseSkillsJson(stage.getSkillsJson());
            int xPos = 240 * stageNum;

            List<String> currentStageNodeIds = new ArrayList<>();

            for (int kIdx = 0; kIdx < skills.size(); kIdx++) {
                String skillName = skills.get(kIdx);
                String skillSlug = skillName.toLowerCase().replaceAll("[^a-z0-9]+", "-");
                String nodeId = "node-" + skillSlug + "-" + stageNum;

                String status = statusMap.getOrDefault(skillSlug,
                        statusMap.getOrDefault(skillName.toLowerCase(), "missing"));

                if (status.contains("verified")) verifiedCount++;
                else if (status.contains("partial") || status.contains("claimed") || status.contains("evidence")) partialCount++;
                else missingCount++;

                int yPos = 80 + (kIdx * 90);

                Map<String, Object> skillNode = new HashMap<>();
                skillNode.put("id", nodeId);
                skillNode.put("type", "horizontalSkillNode");
                skillNode.put("position", Map.of("x", xPos, "y", yPos));
                skillNode.put("data", Map.of(
                        "skillId", skillSlug,
                        "label", skillName,
                        "status", status,
                        "currentLevel", status.contains("verified") ? "Advanced" : (status.contains("missing") ? "None" : "Intermediate"),
                        "requiredLevel", "Intermediate",
                        "category", stage.getStageName(),
                        "stageNumber", stageNum
                ));
                nodes.add(skillNode);
                currentStageNodeIds.add(nodeId);

                // Add edge from previous stage
                for (String prevId : prevStageNodeIds) {
                    Map<String, Object> edge = new HashMap<>();
                    edge.put("id", "e-" + prevId + "-" + nodeId);
                    edge.put("source", prevId);
                    edge.put("target", nodeId);
                    edge.put("animated", status.contains("verified"));
                    edges.add(edge);
                }
            }

            prevStageNodeIds = currentStageNodeIds;
        }

        int totalSkills = verifiedCount + partialCount + missingCount;
        int coverage = totalSkills > 0 ? Math.round(((verifiedCount * 1.0f + partialCount * 0.5f) / totalSkills) * 100) : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("roleTitle", role.getTitle());
        result.put("pathwayTitle", selectedPathway != null ? selectedPathway.getTitle() : role.getTitle());
        result.put("pathwayId", selectedPathway != null ? selectedPathway.getId() : "");
        result.put("nodes", nodes);
        result.put("edges", edges);
        result.put("coverageStats", Map.of(
                "coverage", coverage,
                "verified", verifiedCount,
                "partial", partialCount,
                "missing", missingCount
        ));

        return result;
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

    private List<String> parseSkillsJson(String json) {
        if (json == null || json.trim().isEmpty()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            String sanitized = json.replace("[", "").replace("]", "").replace("\"", "");
            String[] parts = sanitized.split(",");
            List<String> list = new ArrayList<>();
            for (String p : parts) {
                if (!p.trim().isEmpty()) list.add(p.trim());
            }
            return list;
        }
    }
}
