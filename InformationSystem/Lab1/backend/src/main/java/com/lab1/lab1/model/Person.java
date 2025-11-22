package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.Color;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "persons", uniqueConstraints = @UniqueConstraint(columnNames = "passport_id"))
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPerName() {
        return perName;
    }

    public void setPerName(String perName) {
        this.perName = perName;
    }

    public Color getEyeColor() {
        return eyeColor;
    }

    public void setEyeColor(Color eyeColor) {
        this.eyeColor = eyeColor;
    }

    public Color getHairColor() {
        return hairColor;
    }

    public void setHairColor(Color hairColor) {
        this.hairColor = hairColor;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocalDateTime getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDateTime birthday) {
        this.birthday = birthday;
    }

    public Long getHeight() {
        return height;
    }

    public void setHeight(Long height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getPassportID() {
        return passportID;
    }

    public void setPassportID(String passportID) {
        this.passportID = passportID;
    }
}
