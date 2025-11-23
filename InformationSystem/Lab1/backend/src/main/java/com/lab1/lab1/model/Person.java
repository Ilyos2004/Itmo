package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.Color;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "persons", uniqueConstraints = @UniqueConstraint(columnNames = "passport_id"))
@Data
public class Person {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String perName;

    @Enumerated(EnumType.STRING)
    private Color eyeColor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color", nullable = false)
    private Color hairColor;

    @Embedded
    @NotNull
    private Location location;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime birthday;

    @Positive
    private Long height;

    @Positive
    private Double weight;

    @NotNull
    @NotBlank
    @Size(max = 47)
    @Column(name = "passport_id", nullable = false, length = 47)
    private String passportID;
}
