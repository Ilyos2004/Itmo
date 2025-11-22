package com.lab1.lab1.controller;

import com.lab1.lab1.model.Worker;
import com.lab1.lab1.dto.WorkerDto;
import com.lab1.lab1.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/special")
public class SpecialOpsController {

    @Autowired
    private WorkerService specialOpsService;

    // Количество работников с указанным рейтингом
    @GetMapping("/count-by-rating")
    public ResponseEntity<Integer> countByRating(@RequestParam int rating) {
        return ResponseEntity.ok((int) specialOpsService.countByRating(rating));
    }

    // Список работников с startDate
    @GetMapping("/start-before")
    public ResponseEntity<List<WorkerDto>> startBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime ts) {

        List<Worker> workers = specialOpsService.workersWithStartBefore(ts);
        List<WorkerDto> dtos = workers.stream()
                .map(WorkerDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Уникальные ID Person
    @GetMapping("/unique-persons")
    public ResponseEntity<List<Long>> uniquePersons() {
        return ResponseEntity.ok(specialOpsService.uniquePersonIds());
    }

    // Уволить работника
    @PostMapping("/fire")
    public ResponseEntity<Void> fire(@RequestParam Long id) {
        specialOpsService.fireWorkerById(id);
        return ResponseEntity.noContent().build();
    }

    // Проиндексировать зарплату
    @PostMapping("/index-salary")
    public ResponseEntity<Void> indexSalary(@RequestParam Long id, @RequestParam double factor) {
        specialOpsService.indexSalary(id, factor);
        return ResponseEntity.noContent().build();
    }
}
