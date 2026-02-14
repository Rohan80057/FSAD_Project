package com.apex.portfolio.controller;

import com.apex.portfolio.model.Transaction;
import com.apex.portfolio.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getHistory(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        return transactionRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
