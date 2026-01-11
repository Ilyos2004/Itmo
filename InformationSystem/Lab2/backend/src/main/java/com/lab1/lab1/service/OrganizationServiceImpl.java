package com.lab1.lab1.service;

import com.lab1.lab1.model.Organization;
import com.lab1.lab1.repository.OrganizationRepository;
import com.lab1.lab1.dto.OrganizationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository repo;

        @Autowired
    public OrganizationServiceImpl(OrganizationRepository repo) {
        this.repo = repo;
    }

    @Override
    //Создаёт новую организацию
    public OrganizationDto create(OrganizationDto dto) {
        if (repo.existsByOrgName(dto.getOrgName())) {
            throw new RuntimeException("Organization name must be unique");
        }

        Organization org = dto.toEntity();
        Organization saved = repo.saveAndFlush(org);
        return OrganizationDto.fromEntity(saved);
    }

    @Override
    //Возвращает организацию по её ID.
    public OrganizationDto findById(Long id) {
        Organization org = repo.findById(id).orElseThrow(() -> new RuntimeException("Organization not found"));
        return OrganizationDto.fromEntity(org);
    }

    @Override
    //Обновляет существующую организацию
    public OrganizationDto update(Long id, OrganizationDto dto) {
        Organization org = repo.findById(id).orElseThrow(() -> new RuntimeException("Organization not found"));
        dto.applyToEntity(org);
        repo.save(org);
        return OrganizationDto.fromEntity(org);
    }

    @Override
    //Удаляет запись из таблицы
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    //Возвращает список всех организаций
    public Page<OrganizationDto> list(String filterField, String filterValue, Pageable pageable) {
        Page<Organization> p = repo.findAll(pageable);
        return p.map(OrganizationDto::fromEntity);
    }
}
