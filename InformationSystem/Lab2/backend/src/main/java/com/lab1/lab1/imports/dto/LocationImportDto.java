package com.lab1.lab1.imports.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LocationImportDto(
        @NotNull Double x,
        @NotNull Integer y,
        @NotNull Double z,
        @NotBlank String name
) {}
