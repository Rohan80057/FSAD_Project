package com.apex.portfolio.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MockStockPriceService implements StockPriceService {

    private final Map<String, BigDecimal> mockPrices = new HashMap<>();
    private final Random random = new Random();

    public MockStockPriceService() {
        // Initialize with some fake data
        mockPrices.put("RELIANCE", new BigDecimal("2500.00"));
        mockPrices.put("TCS", new BigDecimal("3500.00"));
        mockPrices.put("INFY", new BigDecimal("1500.00"));
        mockPrices.put("HDFCBANK", new BigDecimal("1600.00"));
        mockPrices.put("ICICIBANK", new BigDecimal("950.00"));
    }

    @Override
    public BigDecimal getPrice(String symbol) {
        BigDecimal basePrice = mockPrices.getOrDefault(symbol.toUpperCase(), new BigDecimal("100.00"));

        // Add some random +/ - 1% fluctuation
        double fluctuation = (random.nextDouble() - 0.5) * 0.02; // -1% to +1%
        BigDecimal currentPrice = basePrice.multiply(BigDecimal.valueOf(1 + fluctuation));

        return currentPrice; // Rounding can be done at display level
    }
}
