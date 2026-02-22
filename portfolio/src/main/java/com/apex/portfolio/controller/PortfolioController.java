package com.apex.portfolio.controller;

import com.apex.portfolio.dto.PortfolioDTO;
import com.apex.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public PortfolioDTO getPortfolio(@AuthenticationPrincipal Jwt jwt) {
        // Fallback for development if JWT is missing (e.g., separate dev profile)
        // But for production-like setup, we expect JWT.
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        try {
            return portfolioService.getPortfolio(userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage() + " | Cause: " + e.getCause());
        }
    }
}
