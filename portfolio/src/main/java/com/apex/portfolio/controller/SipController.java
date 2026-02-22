package com.apex.portfolio.controller;

import com.apex.portfolio.model.Sip;
import com.apex.portfolio.repository.SipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sips")
@RequiredArgsConstructor
public class SipController {

    private final SipRepository sipRepository;

    @GetMapping
    public List<Sip> getSips(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        return sipRepository.findByUserId(userId);
    }

    @PostMapping
    public Sip createSip(@AuthenticationPrincipal Jwt jwt, @RequestBody Sip sip) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        sip.setUserId(userId);
        return sipRepository.save(sip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSip(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        return sipRepository.findById((Long) id)
                .map(sip -> {
                    if (sip.getUserId().equals(userId)) {
                        sipRepository.delete(sip);
                        return ResponseEntity.ok().<Void>build();
                    }
                    return ResponseEntity.status(403).<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
