package com.lab1.lab1.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class Location {
    @NotNull
    private Double x;
    private int y;
    @NotNull
    private Double z;
    @NotNull
    private String name;

    public Location() {}

    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    public int getY() { return y; }
    public void setY(int y) { this.y = y; }
    public Double getZ() { return z; }
    public void setZ(Double z) { this.z = z; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
