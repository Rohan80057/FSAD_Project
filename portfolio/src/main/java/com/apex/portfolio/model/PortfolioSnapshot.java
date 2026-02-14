package com.apex.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "portfolio_snapshots")
public class PortfolioSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private LocalDate date;

    private BigDecimal totalValue; // Assets + Cash
    private BigDecimal investedAmount; // Assets Cost Basis
    private BigDecimal cashBalance;
    private BigDecimal unrealizedPnL;
    private BigDecimal realizedPnL;
}
