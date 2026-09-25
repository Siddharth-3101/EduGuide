package com.skillbridge.skill.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Evidence;
import com.skillbridge.common.model.Skill;
import com.skillbridge.common.model.StudentSkill;
import com.skillbridge.common.model.enums.EvidenceType;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.EvidenceRepository;
import com.skillbridge.common.repository.SkillRepository;
import com.skillbridge.common.repository.StudentSkillRepository;
import com.skillbridge.skill.dto.VerifySkillRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final EvidenceRepository evidenceRepository;

    public SkillService(SkillRepository skillRepository, StudentSkillRepository studentSkillRepository, EvidenceRepository evidenceRepository) {
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.evidenceRepository = evidenceRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillBySkillId(String skillId) {
        if (skillId == null || skillId.trim().isEmpty()) {
            skillId = "java";
        }
        String searchId = skillId.trim();
        java.util.Optional<Skill> opt = skillRepository.findBySkillId(searchId);
        if (opt.isPresent()) {
            return opt.get();
        }
        try {
            Long numericId = Long.parseLong(searchId);
            List<Skill> all = skillRepository.findAll();
            if (numericId > 0 && numericId <= all.size()) {
                return all.get((int) (numericId - 1));
            }
        } catch (NumberFormatException ignored) {}

        return skillRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + searchId));
    }

    public List<String> getCategories() {
        return Arrays.asList("Programming", "Backend", "Frontend", "Database", "Cloud", "DevOps", "Data", "AI/ML", "Cybersecurity");
    }

    public List<Skill> searchSkills(String query, String category) {
        List<Skill> skills = skillRepository.findAll();

        if (category != null && !category.equalsIgnoreCase("All")) {
            skills = skills.stream()
                    .filter(s -> s.getCategory() != null && s.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (query != null && !query.trim().isEmpty()) {
            String q = query.toLowerCase();
            skills = skills.stream()
                    .filter(s -> s.getName().toLowerCase().contains(q) ||
                            (s.getDescription() != null && s.getDescription().toLowerCase().contains(q)) ||
                            (s.getCategory() != null && s.getCategory().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return skills;
    }

    public List<StudentSkill> getStudentSkills(Long userId) {
        return studentSkillRepository.findByUserId(userId);
    }

    public StudentSkill getStudentSkillBySkillId(Long userId, String skillId) {
        Skill masterSkill = getSkillBySkillId(skillId);
        String resolvedSkillId = masterSkill.getSkillId();
        return studentSkillRepository.findByUserIdAndSkillId(userId, resolvedSkillId)
                .orElseGet(() -> StudentSkill.builder()
                        .userId(userId)
                        .skillId(masterSkill.getSkillId())
                        .name(masterSkill.getName())
                        .category(masterSkill.getCategory())
                        .level("Beginner")
                        .status(SkillStatus.MISSING)
                        .score(0)
                        .evidenceCount(0)
                        .build());
    }

    @Transactional
    public StudentSkill verifySkill(Long userId, String skillId, VerifySkillRequest request) {
        Skill masterSkill = getSkillBySkillId(skillId);
        String resolvedSkillId = masterSkill.getSkillId();
        StudentSkill studentSkill = studentSkillRepository.findByUserIdAndSkillId(userId, resolvedSkillId)
                .orElseGet(() -> StudentSkill.builder()
                        .userId(userId)
                        .skillId(masterSkill.getSkillId())
                        .name(masterSkill.getName())
                        .category(masterSkill.getCategory())
                        .level("Intermediate")
                        .build());

        studentSkill.setStatus(SkillStatus.VERIFIED);
        studentSkill.setScore(Math.max(studentSkill.getScore() != null ? studentSkill.getScore() : 0, 85));
        studentSkill.setEvidenceCount((studentSkill.getEvidenceCount() != null ? studentSkill.getEvidenceCount() : 0) + 1);

        studentSkill = studentSkillRepository.save(studentSkill);

        Evidence evidence = Evidence.builder()
                .userId(userId)
                .skillId(resolvedSkillId)
                .name(request != null && request.getName() != null ? request.getName() : "Verified via Skill Assessment")
                .type(request != null && request.getType() != null ? EvidenceType.valueOf(request.getType().toUpperCase()) : EvidenceType.ASSESSMENT)
                .score(request != null && request.getScore() != null ? request.getScore() : "85%")
                .status("VERIFIED")
                .verifiedAt("Just now")
                .build();
        evidenceRepository.save(evidence);

        return studentSkill;
    }
}
