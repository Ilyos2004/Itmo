package com.lab1.lab1.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Embeddable
@Data
public class Coordinates {
    private int x;
    @NotNull
    private Double y;

}
