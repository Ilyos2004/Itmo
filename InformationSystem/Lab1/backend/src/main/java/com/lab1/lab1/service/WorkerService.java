package com.lab1.lab1.service;

import com.lab1.lab1.dto.WorkerDto;
import com.lab1.lab1.model.Worker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.List;

public interface WorkerService {
    WorkerDto create(WorkerDto dto);
    WorkerDto findById(Long id);
    WorkerDto update(Long id, WorkerDto dto);
    void delete(Long id);
    Page<WorkerDto> list(String filterField, String filterValue, Pageable pageable);
    void indexSalary(Long id, double factor);
    void fireWorkerById(Long id);
    List<Long> uniquePersonIds();
    List<Worker> workersWithStartBefore(ZonedDateTime zdt);
    long countByRating(int rating);
}
