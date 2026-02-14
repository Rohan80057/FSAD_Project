package com.apex.portfolio.repository;

import com.apex.portfolio.model.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    List<PortfolioSnapshot> findByUserIdOrderByDateAsc(String userId);

    Optional<PortfolioSnapshot> findByUserIdAndDate(String userId, LocalDate date);
}
