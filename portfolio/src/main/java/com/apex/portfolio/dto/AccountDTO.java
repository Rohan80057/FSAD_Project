package com.apex.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private String name;
    private String accountType; // BROKERAGE, BANK, CRYPTO, RETIREMENT
    private String institution;
    private String currency;
}
