package com.apex.portfolio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name; // e.g. "Robinhood", "Zerodha", "Chase"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccountType accountType = AccountType.BROKERAGE;

    private String institution;

    @Builder.Default
    private String currency = "INR";

    @Builder.Default
    private Boolean isDefault = false;

    public enum AccountType {
        BROKERAGE, BANK, CRYPTO, RETIREMENT
    }
}
