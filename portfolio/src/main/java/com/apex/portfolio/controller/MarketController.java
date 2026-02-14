package com.apex.portfolio.controller;

import com.apex.portfolio.service.StockPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    private final StockPriceService stockPriceService;

    @GetMapping("/quote/{symbol}")
    public Map<String, Object> getQuote(@PathVariable String symbol) {
        BigDecimal price = stockPriceService.getPrice(symbol);
        Map<String, Object> result = new HashMap<>();
        result.put("symbol", symbol.toUpperCase());
        result.put("price", price);
        return result;
    }

    @GetMapping("/search/{query}")
    public Map<String, Object> searchTicker(@PathVariable String query) {
        // Simple lookup — try to get a quote. If it works, the ticker is valid.
        Map<String, Object> result = new HashMap<>();
        try {
            BigDecimal price = stockPriceService.getPrice(query);
            result.put("symbol", query.toUpperCase());
            result.put("price", price);
            result.put("found", true);
        } catch (Exception e) {
            result.put("symbol", query.toUpperCase());
            result.put("found", false);
            result.put("error", e.getMessage());
        }
        return result;
    }
}
