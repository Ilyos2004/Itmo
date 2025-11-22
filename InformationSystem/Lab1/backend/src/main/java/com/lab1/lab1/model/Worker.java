package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Date;
import java.time.ZonedDateTime;

@Entity
@Table(name = "workers")
@Data
public class    Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @NotBlank
    @Column(nullable = false)
    private String name;

    @Embedded
    @NotNull
    private Coordinates coordinates;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", nullable = false, updatable = false)
    private Date creationDate;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Positive
    @Column(nullable = false)
    private double salary;

    @Positive
    private Integer rating;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private ZonedDateTime startDate;

    private java.time.LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @PrePersist
    public void prePersist() {
        creationDate = new Date();
    }

}
