package com.lab1.lab1.imports;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "import_operations")
@Getter @Setter
public class ImportOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ImportStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ImportObjectType objectType;

    @Column(nullable = false, length = 64)
    private String username;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant finishedAt;

    // только для SUCCESS
    private Integer addedCount;

    // для FAILED
    @Column(length = 2000)
    private String errorMessage;
}
