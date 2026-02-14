package com.apex.portfolio.service;

import com.apex.portfolio.dto.PortfolioDTO;
import com.apex.portfolio.model.PortfolioSnapshot;
import com.apex.portfolio.model.User;
import com.apex.portfolio.repository.PortfolioSnapshotRepository;
import com.apex.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SnapshotService {

    private final UserRepository userRepository;
    private final PortfolioService portfolioService;
    private final PortfolioSnapshotRepository snapshotRepository;

    // Run every day at midnight (00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void captureDailySnapshots() {
        List<User> users = userRepository.findAll();
        LocalDate today = LocalDate.now();

        for (User user : users) {
            try {
                PortfolioDTO portfolio = portfolioService.getPortfolio(user.getId());

                PortfolioSnapshot snapshot = PortfolioSnapshot.builder()
                        .userId(user.getId())
                        .date(today)
                        .totalValue(portfolio.getNetWorth()) // Net Worth = Assets + Cash
                        .investedAmount(portfolio.getTotalInvested())
                        .cashBalance(portfolio.getCashBalance())
                        .unrealizedPnL(portfolio.getTotalPnL())
                        .realizedPnL(portfolio.getRealizedPnL())
                        .build();

                snapshotRepository.save(snapshot);
            } catch (Exception e) {
                System.err.println("Failed to capture snapshot for user: " + user.getId());
                e.printStackTrace();
            }
        }
    }

    // Manual trigger for testing
    public void captureSnapshotsNow() {
        captureDailySnapshots();
    }
}
