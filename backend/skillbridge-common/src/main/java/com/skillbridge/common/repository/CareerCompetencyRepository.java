package com.skillbridge.common.repository;

import com.skillbridge.common.model.CareerCompetency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerCompetencyRepository extends JpaRepository<CareerCompetency, Long> {
    List<CareerCompetency> findByRoleId(String roleId);
}
