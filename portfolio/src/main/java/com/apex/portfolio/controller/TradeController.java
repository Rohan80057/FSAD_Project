package com.apex.portfolio.controller;

import com.apex.portfolio.dto.TradeRequest;
import com.apex.portfolio.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    @PostMapping
    public ResponseEntity<String> executeTrade(@AuthenticationPrincipal Jwt jwt, @RequestBody TradeRequest request) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        try {
            tradeService.executeTrade(userId, request);
            return ResponseEntity.ok("Trade executed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
