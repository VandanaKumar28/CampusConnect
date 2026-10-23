package com.campusconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "Seminar Hall A", "Basketball Court"

    @Column(nullable = false)
    private String category; // LAB, HALL, COURT, EQUIPMENT

    private String location;

    private Integer capacity;

    @Column(nullable = false)
    @Builder.Default
    private boolean requiresApproval = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    // Optimistic locking: prevents two admins editing the same
    // resource simultaneously from silently overwriting each other.
    @Version
    private Long version;
}
