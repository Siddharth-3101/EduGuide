package com.skillbridge.common.repository;

import com.skillbridge.common.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByUserId(Long userId);
    List<Evidence> findByUserIdAndSkillId(Long userId, String skillId);
}
