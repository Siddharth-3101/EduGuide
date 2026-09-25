package com.skillbridge.evidence.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Evidence;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.EvidenceRepository;
import com.skillbridge.common.repository.StudentSkillRepository;
import com.skillbridge.evidence.dto.CreateEvidenceRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final StudentSkillRepository studentSkillRepository;

    public EvidenceService(EvidenceRepository evidenceRepository, StudentSkillRepository studentSkillRepository) {
        this.evidenceRepository = evidenceRepository;
        this.studentSkillRepository = studentSkillRepository;
    }

    @Transactional
    public Evidence addEvidence(Long userId, CreateEvidenceRequest request) {
        Evidence evidence = Evidence.builder()
                .userId(userId)
                .skillId(request.getSkillId())
                .name(request.getName())
                .type(request.getType())
                .fileUrl(request.getFileUrl() != null ? request.getFileUrl() : "https://skillbridge.internal/evidence/" + System.currentTimeMillis())
                .score(request.getScore() != null ? request.getScore() : "Pass")
                .status("VERIFIED")
                .verifiedAt("Just now")
                .build();

        evidence = evidenceRepository.save(evidence);

        if (request.getSkillId() != null) {
            studentSkillRepository.findByUserIdAndSkillId(userId, request.getSkillId()).ifPresent(s -> {
                s.setEvidenceCount((s.getEvidenceCount() != null ? s.getEvidenceCount() : 0) + 1);
                if (s.getStatus() == SkillStatus.MISSING || s.getStatus() == SkillStatus.CLAIMED) {
                    s.setStatus(SkillStatus.PARTIAL);
                }
                studentSkillRepository.save(s);
            });
        }

        return evidence;
    }

    public List<Evidence> getEvidenceForUser(Long userId) {
        return evidenceRepository.findByUserId(userId);
    }

    public Evidence getEvidenceById(Long userId, Long id) {
        return evidenceRepository.findById(id)
                .orElseGet(() -> evidenceRepository.findByUserId(userId).stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with ID: " + id)));
    }

    public List<Evidence> getEvidenceBySkillId(Long userId, String skillId) {
        return evidenceRepository.findByUserIdAndSkillId(userId, skillId);
    }

    public void deleteEvidence(Long userId, Long id) {
        Evidence evidence = getEvidenceById(userId, id);
        evidenceRepository.delete(evidence);
    }
}
