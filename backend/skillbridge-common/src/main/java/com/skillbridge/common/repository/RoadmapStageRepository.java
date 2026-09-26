package com.skillbridge.common.repository;

import com.skillbridge.common.model.RoadmapStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapStageRepository extends JpaRepository<RoadmapStage, Long> {
    List<RoadmapStage> findByPathwayIdOrderByStageNumberAsc(String pathwayId);
}
