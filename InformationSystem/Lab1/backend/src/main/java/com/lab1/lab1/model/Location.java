package com.lab1.lab1.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Embeddable
@Data
public class Location {
    @NotNull
    private Double x;
    private int y;
    @NotNull
    private Double z;
    @NotNull
    private String name;

    public Location() {}

}
