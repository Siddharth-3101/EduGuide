package com.skillbridge.common.repository;

import com.skillbridge.common.model.ProjectProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectProgressRepository extends JpaRepository<ProjectProgress, Long> {
    List<ProjectProgress> findByUserId(Long userId);
    Optional<ProjectProgress> findByUserIdAndProjectId(Long userId, Long projectId);
}
