package com.lab1.lab1.controller;

import com.lab1.lab1.service.WorkerService;
import com.lab1.lab1.dto.WorkerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService service;

    @Autowired
    public WorkerController(WorkerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<WorkerDto> create(@Valid @RequestBody WorkerDto dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerDto> update(@PathVariable Long id, @Valid @RequestBody WorkerDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<WorkerDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.list(null, null, pageable));
    }
}
