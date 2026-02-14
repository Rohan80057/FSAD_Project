package com.apex.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDTO {
    private BigDecimal totalValue;
    private BigDecimal totalInvested;
    private BigDecimal totalPnL;
    private BigDecimal totalPnLPercentage;
    private BigDecimal dayPnL;
    private BigDecimal cashBalance; // NEW
    private BigDecimal realizedPnL; // NEW
    private BigDecimal netWorth; // NEW (Cash + Assets)
    private HoldingDTO topGainer;
    private HoldingDTO topLoser;
    private List<HoldingDTO> holdings;
}
