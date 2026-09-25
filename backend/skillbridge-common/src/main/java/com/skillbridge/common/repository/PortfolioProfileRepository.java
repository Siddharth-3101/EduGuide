package com.skillbridge.common.repository;

import com.skillbridge.common.model.PortfolioProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, Long> {
    Optional<PortfolioProfile> findByUserId(Long userId);
    Optional<PortfolioProfile> findByUsername(String username);
    Optional<PortfolioProfile> findByShareToken(String shareToken);
}
