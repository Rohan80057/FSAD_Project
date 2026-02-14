package com.apex.portfolio.controller;

import com.apex.portfolio.model.PortfolioSnapshot;
import com.apex.portfolio.repository.PortfolioSnapshotRepository;
import com.apex.portfolio.service.SnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snapshots")
@RequiredArgsConstructor
public class SnapshotController {

    private final PortfolioSnapshotRepository snapshotRepository;
    private final SnapshotService snapshotService;

    @GetMapping
    public List<PortfolioSnapshot> getSnapshots(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        return snapshotRepository.findByUserIdOrderByDateAsc(userId);
    }

    @PostMapping("/capture")
    public ResponseEntity<String> triggerCapture() {
        snapshotService.captureSnapshotsNow();
        return ResponseEntity.ok("Snapshots captured");
    }
}
