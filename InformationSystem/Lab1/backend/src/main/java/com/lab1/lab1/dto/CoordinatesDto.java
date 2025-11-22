package com.lab1.lab1.dto;

import com.lab1.lab1.model.Coordinates;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
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
}
