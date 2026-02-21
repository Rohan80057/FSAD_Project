package com.apex.portfolio.service;

import com.apex.portfolio.dto.TradeRequest;
import com.apex.portfolio.model.Holding;
import com.apex.portfolio.model.Transaction;
import com.apex.portfolio.model.User;
import com.apex.portfolio.repository.HoldingRepository;
import com.apex.portfolio.repository.TransactionRepository;
import com.apex.portfolio.repository.UserRepository;
import com.apex.portfolio.service.SnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final StockPriceService stockPriceService;
    private final SnapshotService snapshotService;

    @Transactional
    public void executeTrade(String userId, TradeRequest request) {
        String symbol = request.getSymbol().toUpperCase();
        Integer quantity = request.getQuantity();
        Transaction.TransactionType type = Transaction.TransactionType.valueOf(request.getType().toUpperCase());
        Double currentPriceVal = stockPriceService.getPrice(symbol).doubleValue();
        BigDecimal price = BigDecimal.valueOf(currentPriceVal);
        BigDecimal tradeValue = price.multiply(BigDecimal.valueOf(quantity));

        // 1. Get or Create User (Ensure financial state exists)
        User user = userRepository.findById(userId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .id(userId)
                            .email("user@example.com") // Placeholder
                            .cashBalance(BigDecimal.ZERO)
                            .realizedPnL(BigDecimal.ZERO)
                            .build();
                    return userRepository.save(newUser);
                });

        // 2. Validate & Update Cash/PnL
        if (type == Transaction.TransactionType.BUY) {
            if (user.getCashBalance().compareTo(tradeValue) < 0) {
                throw new RuntimeException(
                        "Insufficient Funds! Available: " + user.getCashBalance() + ", Required: " + tradeValue);
            }
            user.setCashBalance(user.getCashBalance().subtract(tradeValue));
        } else if (type == Transaction.TransactionType.SELL) {
            // Check ownership is done below, but we need average price for PnL
            // Logic handled in Holding update section
        }

        // 3. Update Holdings
        Optional<Holding> existingHoldingOpt = holdingRepository.findByUserIdAndSymbol(userId, symbol);

        if (type == Transaction.TransactionType.BUY) {
            if (existingHoldingOpt.isPresent()) {
                Holding holding = existingHoldingOpt.get();
                // Weighted Average Logic
                BigDecimal oldTotal = BigDecimal.valueOf(holding.getAveragePrice())
                        .multiply(BigDecimal.valueOf(holding.getQuantity()));
                BigDecimal newTotal = oldTotal.add(tradeValue);
                int newQty = holding.getQuantity() + quantity;
                BigDecimal newAvg = newTotal.divide(BigDecimal.valueOf(newQty), 4, java.math.RoundingMode.HALF_UP);

                holding.setQuantity(newQty);
                holding.setAveragePrice(newAvg.doubleValue());
                holdingRepository.save(holding);
            } else {
                Holding newHolding = Holding.builder()
                        .userId(userId)
                        .symbol(symbol)
                        .quantity(quantity)
                        .averagePrice(price.doubleValue())
                        .build();
                holdingRepository.save(newHolding);
            }
        } else if (type == Transaction.TransactionType.SELL) {
            if (existingHoldingOpt.isEmpty()) {
                throw new RuntimeException("Cannot sell stock not owned: " + symbol);
            }
            Holding holding = existingHoldingOpt.get();
            if (holding.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient quantity to sell");
            }

            // Realized PnL Calculation
            BigDecimal avgPrice = BigDecimal.valueOf(holding.getAveragePrice());
            BigDecimal sellPnlPerUnit = price.subtract(avgPrice); // (SellPrice - BuyAvg)
            BigDecimal totalSellPnl = sellPnlPerUnit.multiply(BigDecimal.valueOf(quantity));

            user.setRealizedPnL(user.getRealizedPnL().add(totalSellPnl));
            user.setCashBalance(user.getCashBalance().add(tradeValue)); // Add cash back (Principal + Profit)

            int remainingQty = holding.getQuantity() - quantity;
            if (remainingQty == 0) {
                holdingRepository.delete(holding);
            } else {
                holding.setQuantity(remainingQty);
                holdingRepository.save(holding);
            }
        }

        // 4. Save User State & Record Transaction
        userRepository.save(user);

        Transaction transaction = Transaction.builder()
                .userId(userId)
                .symbol(symbol)
                .quantity(quantity)
                .type(type)
                .price(price.doubleValue())
                .timestamp(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        // Capture snapshot so portfolio chart updates immediately
        try {
            snapshotService.captureSnapshotsNow();
        } catch (Exception ignored) {
        }
    }
}
