package com.lab1.lab1.service;

import com.lab1.lab1.dto.OrganizationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrganizationService {
    OrganizationDto create(OrganizationDto dto);
    OrganizationDto findById(Long id);
    OrganizationDto update(Long id, OrganizationDto dto);
    void delete(Long id);
    Page<OrganizationDto> list(String filterField, String filterValue, Pageable pageable);
}
