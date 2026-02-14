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
public class TradeRequest {
    private String symbol;
    private Integer quantity;
    private String type; // BUY or SELL
    // userId will be extracted from the token/context
}
