package com.skillbridge.common.repository;

import com.skillbridge.common.model.Pathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathwayRepository extends JpaRepository<Pathway, String> {
    List<Pathway> findByCareerRoleId(String careerRoleId);
}
