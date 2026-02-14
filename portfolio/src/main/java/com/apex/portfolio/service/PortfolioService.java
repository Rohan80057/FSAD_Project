package com.apex.portfolio.service;

import com.apex.portfolio.dto.HoldingDTO;
import com.apex.portfolio.dto.PortfolioDTO;
import com.apex.portfolio.model.Holding;
import com.apex.portfolio.model.User;
import com.apex.portfolio.repository.HoldingRepository;
import com.apex.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final StockPriceService stockPriceService;
    private final UserRepository userRepository; // Inject User Repo

    public PortfolioDTO getPortfolio(String userId) {
        // 0. Fetch User Financials
        User user = userRepository.findById(userId)
                .orElse(User.builder()
                        .cashBalance(BigDecimal.ZERO)
                        .realizedPnL(BigDecimal.ZERO)
                        .build());

        List<Holding> holdings = holdingRepository.findByUserId(userId);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;

        // 1. First Pass: Calculate basic values and totals
        List<HoldingDTO> tempHoldings = new java.util.ArrayList<>();

        for (Holding holding : holdings) {
            BigDecimal currentPrice = stockPriceService.getPrice(holding.getSymbol());
            BigDecimal avgPrice = BigDecimal.valueOf(holding.getAveragePrice());
            BigDecimal quantity = BigDecimal.valueOf(holding.getQuantity());

            BigDecimal invested = avgPrice.multiply(quantity);
            BigDecimal currentVal = currentPrice.multiply(quantity);

            BigDecimal pnl = currentVal.subtract(invested);
            BigDecimal pnlPercent = invested.compareTo(BigDecimal.ZERO) > 0
                    ? pnl.divide(invested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            tempHoldings.add(HoldingDTO.builder()
                    .symbol(holding.getSymbol())
                    .quantity(holding.getQuantity())
                    .averagePrice(avgPrice)
                    .currentPrice(currentPrice)
                    .currentValue(currentVal)
                    .pnl(pnl)
                    .pnlPercentage(pnlPercent)
                    .build());

            totalValue = totalValue.add(currentVal);
            totalInvested = totalInvested.add(invested);
        }

        // 2. Second Pass: Calculate Allocation % and Find Gainer/Loser
        List<HoldingDTO> finalHoldings = new java.util.ArrayList<>();
        HoldingDTO topGainer = null;
        HoldingDTO topLoser = null;

        for (HoldingDTO h : tempHoldings) {
            // Allocation
            BigDecimal allocation = totalValue.compareTo(BigDecimal.ZERO) > 0
                    ? h.getCurrentValue().divide(totalValue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;
            h.setAllocationPercentage(allocation);
            finalHoldings.add(h);

            // Gainer/Loser
            if (topGainer == null || h.getPnlPercentage().compareTo(topGainer.getPnlPercentage()) > 0) {
                topGainer = h;
            }
            if (topLoser == null || h.getPnlPercentage().compareTo(topLoser.getPnlPercentage()) < 0) {
                topLoser = h;
            }
        }

        BigDecimal totalPnL = totalValue.subtract(totalInvested);
        BigDecimal totalPnLPercent = totalInvested.compareTo(BigDecimal.ZERO) > 0
                ? totalPnL.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return PortfolioDTO.builder()
                .holdings(finalHoldings)
                .totalValue(totalValue)
                .totalInvested(totalInvested)
                .totalPnL(totalPnL)
                .totalPnLPercentage(totalPnLPercent)
                .dayPnL(BigDecimal.ZERO)
                .cashBalance(user.getCashBalance())
                .realizedPnL(user.getRealizedPnL())
                .netWorth(totalValue.add(user.getCashBalance()))
                .topGainer(topGainer)
                .topLoser(topLoser)
                .build();
    }
}
