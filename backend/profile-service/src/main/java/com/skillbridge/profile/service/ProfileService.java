package com.skillbridge.profile.service;

import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.Evidence;
import com.skillbridge.common.model.StudentProfile;
import com.skillbridge.common.model.User;
import com.skillbridge.common.model.enums.EvidenceType;
import com.skillbridge.common.repository.EvidenceRepository;
import com.skillbridge.common.repository.StudentProfileRepository;
import com.skillbridge.common.repository.UserRepository;
import com.skillbridge.common.service.abstractions.SkillExtractionService;
import com.skillbridge.profile.dto.ProfileDto;
import com.skillbridge.profile.dto.ProfileUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final EvidenceRepository evidenceRepository;
    private final SkillExtractionService skillExtractionService;

    public ProfileService(StudentProfileRepository profileRepository, UserRepository userRepository, EvidenceRepository evidenceRepository, SkillExtractionService skillExtractionService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.evidenceRepository = evidenceRepository;
        this.skillExtractionService = skillExtractionService;
    }

    public ProfileDto getProfileByUserId(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    StudentProfile newProfile = StudentProfile.builder()
                            .userId(user.getId())
                            .fullName(user.getFullName())
                            .email(user.getEmail())
                            .targetRoleId("backend-developer")
                            .targetRoleTitle("Backend Developer")
                            .build();
                    return profileRepository.save(newProfile);
                });

        return mapToDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileUpdateRequest request) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for userId: " + userId));

        if (request.getFullName() != null) profile.setFullName(request.getFullName());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getEducation() != null) profile.setEducation(request.getEducation());
        if (request.getExperienceLevel() != null) profile.setExperienceLevel(request.getExperienceLevel());
        if (request.getTargetRoleId() != null) profile.setTargetRoleId(request.getTargetRoleId());
        if (request.getTargetRoleTitle() != null) profile.setTargetRoleTitle(request.getTargetRoleTitle());
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());

        profile = profileRepository.save(profile);

        if (request.getFullName() != null) {
            userRepository.findById(userId).ifPresent(u -> {
                u.setFullName(request.getFullName());
                userRepository.save(u);
            });
        }

        return mapToDto(profile);
    }

    @Transactional
    public Evidence addResumeEvidence(Long userId, String fileName, String fileUrl, byte[] content) {
        SkillExtractionService.ExtractedSkillResponse response = 
                skillExtractionService.extractSkills(fileName, "RESUME", content);

        Evidence evidence = Evidence.builder()
                .userId(userId)
                .name(fileName)
                .type(EvidenceType.RESUME)
                .fileUrl(fileUrl != null ? fileUrl : "https://skillbridge.internal/uploads/" + fileName)
                .status("VERIFIED")
                .score("85%")
                .verifiedAt("Just now")
                .build();

        Evidence savedEvidence = evidenceRepository.save(evidence);

        profileRepository.findByUserId(userId).ifPresent(p -> {
            p.setResumeUrl(savedEvidence.getFileUrl());
            profileRepository.save(p);
        });

        return savedEvidence;
    }

    @Transactional
    public Evidence addCertificateEvidence(Long userId, String fileName, String fileUrl) {
        Evidence evidence = Evidence.builder()
                .userId(userId)
                .name(fileName)
                .type(EvidenceType.CERTIFICATE)
                .fileUrl(fileUrl != null ? fileUrl : "https://skillbridge.internal/certificates/" + fileName)
                .status("VERIFIED")
                .score("90%")
                .verifiedAt("Just now")
                .build();

        return evidenceRepository.save(evidence);
    }

    public List<Evidence> getUserEvidence(Long userId) {
        return evidenceRepository.findByUserId(userId);
    }

    public void deleteEvidence(Long userId, Long evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found: " + evidenceId));
        if (!evidence.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Evidence does not belong to user: " + userId);
        }
        evidenceRepository.delete(evidence);
    }

    private ProfileDto mapToDto(StudentProfile p) {
        return ProfileDto.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .fullName(p.getFullName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .education(p.getEducation())
                .experienceLevel(p.getExperienceLevel())
                .targetRoleId(p.getTargetRoleId())
                .targetRoleTitle(p.getTargetRoleTitle())
                .resumeUrl(p.getResumeUrl())
                .certificatesJson(p.getCertificatesJson())
                .build();
    }
}
