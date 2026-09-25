package com.skillbridge.common.repository;

import com.skillbridge.common.model.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    List<AssessmentAttempt> findByUserId(Long userId);
    List<AssessmentAttempt> findByUserIdAndAssessmentId(Long userId, Long assessmentId);
}
