package com.lab1.lab1.imports.dto;

import com.lab1.lab1.model.enums.OrganizationType;
import jakarta.validation.constraints.*;

public record OrganizationImportDto(
        @NotNull @NotBlank String orgName,
        String street,

        @NotNull @Positive Integer annualTurnover,
        @NotNull @Positive Long employeesCount,
        @NotNull @Positive Integer rating,

        @NotNull OrganizationType type
) {}
