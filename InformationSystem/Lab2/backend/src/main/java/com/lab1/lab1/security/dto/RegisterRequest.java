package com.lab1.lab1.security.dto;

import com.lab1.lab1.security.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(@NotBlank String username, @NotBlank String password, @NotNull Role role) {}
