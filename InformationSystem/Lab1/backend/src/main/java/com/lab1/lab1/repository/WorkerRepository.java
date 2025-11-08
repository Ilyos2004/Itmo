package com.lab1.lab1.repository;

import com.lab1.lab1.model.Worker;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.List;


public interface WorkerRepository extends JpaRepository<Worker, Long>, JpaSpecificationExecutor<Worker> {
    Page<Worker> findByNameContainingIgnoreCase(String name, Pageable pageable);
    long countByRating(int rating);
    List<Worker> findByStartDateBefore(ZonedDateTime zdt);
}
