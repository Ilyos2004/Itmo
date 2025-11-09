package com.lab1.lab1.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class Coordinates {
    private int x;
    @NotNull
    private Double y;

    public Coordinates() {}
    public Coordinates(int x, Double y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public void setX(int x) { this.x = x; }
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
}
