package com.apex.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HoldingDTO {
    private String symbol;
    private Integer quantity;
    private BigDecimal averagePrice;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal pnl;
    private BigDecimal pnlPercentage;
    private BigDecimal allocationPercentage;
}
