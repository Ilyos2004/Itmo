package com.lab1.lab1.dto;

import com.lab1.lab1.model.Coordinates;
import jakarta.validation.constraints.NotNull;

public class CoordinatesDto {
    @NotNull
    private Integer x;
    @NotNull
    private Double y;

    public Coordinates toEntity() {
        Coordinates c = new Coordinates();
        c.setX(x);
        c.setY(y);
        return c;
    }

    public static CoordinatesDto fromEntity(Coordinates c) {
        CoordinatesDto dto = new CoordinatesDto();
        dto.x = c.getX();
        dto.y = c.getY();
        return dto;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }
}
