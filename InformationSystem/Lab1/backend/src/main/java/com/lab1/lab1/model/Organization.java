package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.OrganizationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "organizations")
@Data
public class Organization {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String orgName;

    @Embedded
    private Address officialAddress;

    @Positive
    @Column(name = "annual_turnover", nullable = false)
    private int annualTurnover;

    @NotNull
    @Positive
    @Column(name = "employees_count", nullable = false)
    private Long employeesCount;

    @Positive
    @Column(nullable = false)
    private int rating;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type;

}

