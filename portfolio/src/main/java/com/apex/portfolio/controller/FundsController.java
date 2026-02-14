package com.apex.portfolio.controller;

import com.apex.portfolio.model.User;
import com.apex.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundsController {

    private final UserRepository userRepository;

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@AuthenticationPrincipal Jwt jwt, @RequestParam BigDecimal amount) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Deposit amount must be positive");
        }

        User user = userRepository.findById(userId)
                .orElseGet(() -> User.builder()
                        .id(userId)
                        .email("user@example.com")
                        .cashBalance(BigDecimal.ZERO)
                        .realizedPnL(BigDecimal.ZERO)
                        .build());

        user.setCashBalance(user.getCashBalance().add(amount));
        userRepository.save(user);

        return ResponseEntity.ok("Deposited: " + amount + ". New Balance: " + user.getCashBalance());
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@AuthenticationPrincipal Jwt jwt, @RequestParam BigDecimal amount) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        User user = userRepository.findById(userId)
                .orElse(null);

        if (user == null || user.getCashBalance().compareTo(amount) < 0) {
            return ResponseEntity.badRequest().body("Insufficient funds or user not found");
        }

        user.setCashBalance(user.getCashBalance().subtract(amount));
        userRepository.save(user);

        return ResponseEntity.ok("Withdrawn: " + amount + ". New Balance: " + user.getCashBalance());
    }
}
