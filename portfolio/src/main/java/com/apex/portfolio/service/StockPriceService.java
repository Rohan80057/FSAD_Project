package com.apex.portfolio.service;

import java.math.BigDecimal;

public interface StockPriceService {
    BigDecimal getPrice(String symbol);
}
