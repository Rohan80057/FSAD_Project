package com.apex.portfolio.controller;

import com.apex.portfolio.dto.AccountDTO;
import com.apex.portfolio.model.Account;
import com.apex.portfolio.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountRepository accountRepository;

    @GetMapping
    public List<Account> getAccounts(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        return accountRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@AuthenticationPrincipal Jwt jwt, @RequestBody AccountDTO dto) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        Account account = Account.builder()
                .userId(userId)
                .name(dto.getName())
                .accountType(Account.AccountType.valueOf(dto.getAccountType().toUpperCase()))
                .institution(dto.getInstitution())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "INR")
                .build();

        return ResponseEntity.ok(accountRepository.save(account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        return accountRepository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .map(a -> {
                    accountRepository.delete(a);
                    return ResponseEntity.ok("Account deleted");
                })
                .orElse(ResponseEntity.badRequest().body("Account not found"));
    }
}
