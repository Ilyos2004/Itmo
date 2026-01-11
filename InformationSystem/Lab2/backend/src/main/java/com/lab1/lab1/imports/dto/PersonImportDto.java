package com.lab1.lab1.imports.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record PersonImportDto(
        String perName,

        String eyeColor,

        String hairColor,

        @Valid @NotNull LocationImportDto location,

        @NotNull LocalDateTime birthday,

        @Positive Long height,

        @Positive Double weight,

        @NotNull @NotBlank @Size(max = 47) String passportID
) {}
