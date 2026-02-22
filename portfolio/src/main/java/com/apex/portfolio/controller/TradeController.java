package com.apex.portfolio.controller;

import com.apex.portfolio.dto.TradeRequest;
import com.apex.portfolio.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    @PostMapping("/buy")
    public ResponseEntity<String> executeBuy(@AuthenticationPrincipal Jwt jwt, @RequestParam String symbol,
            @RequestParam Integer quantity) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        try {
            TradeRequest req = new TradeRequest();
            req.setSymbol(symbol);
            req.setQuantity(quantity);
            req.setType("BUY");
            tradeService.executeTrade(userId, req);
            return ResponseEntity.ok("Buy trade executed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<String> executeSell(@AuthenticationPrincipal Jwt jwt, @RequestParam String symbol,
            @RequestParam Integer quantity) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        try {
            TradeRequest req = new TradeRequest();
            req.setSymbol(symbol);
            req.setQuantity(quantity);
            req.setType("SELL");
            tradeService.executeTrade(userId, req);
            return ResponseEntity.ok("Sell trade executed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
