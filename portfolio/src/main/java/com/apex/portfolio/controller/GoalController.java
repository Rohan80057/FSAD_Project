package com.apex.portfolio.controller;

import com.apex.portfolio.model.Goal;
import com.apex.portfolio.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalRepository goalRepository;

    @GetMapping
    public List<Goal> getGoals(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        return goalRepository.findByUserId(userId);
    }

    @PostMapping
    public Goal createGoal(@AuthenticationPrincipal Jwt jwt, @RequestBody Goal goal) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";
        goal.setUserId(userId);
        return goalRepository.save(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String userId = jwt != null ? jwt.getSubject() : "test-user-id";

        return goalRepository.findById((Long) id)
                .map(goal -> {
                    if (goal.getUserId().equals(userId)) {
                        goalRepository.delete(goal);
                        return ResponseEntity.ok().<Void>build();
                    }
                    return ResponseEntity.status(403).<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
