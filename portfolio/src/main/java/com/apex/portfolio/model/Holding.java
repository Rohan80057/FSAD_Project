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
@Table(name = "holdings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "symbol"})
})
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId; // Supabase User ID

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double averagePrice;
}
