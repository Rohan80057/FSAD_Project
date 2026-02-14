package com.apex.portfolio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    private String id; // Supabase User ID (UUID)

    private String email;

    private String name;

    @Builder.Default
    private java.math.BigDecimal cashBalance = java.math.BigDecimal.ZERO;

    @Builder.Default
    private java.math.BigDecimal realizedPnL = java.math.BigDecimal.ZERO;
}
