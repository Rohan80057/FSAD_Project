package com.apex.portfolio.controller;

import com.apex.portfolio.service.StockPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
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

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        Map<String, Object> response = new HashMap<>();

        // 1. Market Indices (Using ETFs that track them since Yahoo works best with
        // tickers)
        // SPY = S&P 500, DIA = Dow Jones, QQQ = NASDAQ, IWM = Russell 2000
        List<Map<String, Object>> indices = List.of(
                getSafeQuote("SPY", "S&P 500 ETF"),
                getSafeQuote("DIA", "Dow Jones ETF"),
                getSafeQuote("QQQ", "NASDAQ ETF"),
                getSafeQuote("IWM", "Russell 2000 ETF"));
        response.put("indices", indices);

        // 2. Top Movers (Placeholder logic, in reality would use a dedicated screener
        // API)
        List<Map<String, Object>> movers = List.of(
                getSafeQuote("NVDA", "NVIDIA Corp"),
                getSafeQuote("AAPL", "Apple Inc"),
                getSafeQuote("MSFT", "Microsoft"),
                getSafeQuote("TSLA", "Tesla Inc"),
                getSafeQuote("AMZN", "Amazon"));
        response.put("topMovers", movers);

        return response;
    }

    private Map<String, Object> getSafeQuote(String symbol, String name) {
        Map<String, Object> data = new HashMap<>();
        data.put("symbol", symbol);
        data.put("name", name);
        try {
            BigDecimal price = stockPriceService.getPrice(symbol);
            data.put("price", price);
            // Simulate a daily change since we only have current price right now
            double changePercent = (Math.random() - 0.4) * 3.0; // Random between -1.2% and +1.8%
            data.put("change", BigDecimal.valueOf(changePercent).setScale(2, java.math.RoundingMode.HALF_UP));
        } catch (Exception e) {
            data.put("price", BigDecimal.ZERO);
            data.put("change", BigDecimal.ZERO);
        }
        return data;
    }
}
