package com.lab1.lab1.service;

import com.lab1.lab1.dto.WorkerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkerService {
    WorkerDto create(WorkerDto dto);
    WorkerDto findById(Long id);
    WorkerDto update(Long id, WorkerDto dto);
    void delete(Long id);
    Page<WorkerDto> list(String filterField, String filterValue, Pageable pageable);
}
