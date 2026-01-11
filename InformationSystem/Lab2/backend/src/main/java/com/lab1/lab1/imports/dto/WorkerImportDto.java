package com.lab1.lab1.imports.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.ZonedDateTime;

public record WorkerImportDto(
        @NotNull @NotBlank String name,

        @Valid @NotNull CoordinatesImportDto coordinates,

        @NotNull @Positive Double salary,

        @Positive Integer rating,

        @NotNull ZonedDateTime startDate,
        LocalDate endDate,

        String status,

        @Valid @NotNull OrganizationImportDto organization,
        @Valid PersonImportDto person
) {}
