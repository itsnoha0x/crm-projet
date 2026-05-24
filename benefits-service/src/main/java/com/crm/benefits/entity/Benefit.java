package com.crm.benefits.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "benefits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Benefit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String cardType;

    @Column(nullable = false)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private boolean active;
}
