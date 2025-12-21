package com.lab1.lab1.imports.dto;

import jakarta.validation.constraints.NotNull;

public record CoordinatesImportDto(
        @NotNull Integer x,
        @NotNull Double y
) {}
