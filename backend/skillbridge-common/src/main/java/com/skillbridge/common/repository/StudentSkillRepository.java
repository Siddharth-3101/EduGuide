package com.skillbridge.common.repository;

import com.skillbridge.common.model.StudentSkill;
import com.skillbridge.common.model.enums.SkillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByUserId(Long userId);
    Optional<StudentSkill> findByUserIdAndSkillId(Long userId, String skillId);
    List<StudentSkill> findByUserIdAndStatus(Long userId, SkillStatus status);
}
