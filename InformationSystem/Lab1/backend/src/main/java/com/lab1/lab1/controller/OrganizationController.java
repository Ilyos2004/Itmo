package com.lab1.lab1.controller;

import com.lab1.lab1.model.Organization;
import com.lab1.lab1.service.OrganizationService;
import com.lab1.lab1.dto.OrganizationDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private static final Logger log = LogManager.getLogger(OrganizationController.class);
    private final OrganizationService service;

    @Autowired
    public OrganizationController(OrganizationService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<OrganizationDto> create(@Valid @RequestBody OrganizationDto dto) {
        OrganizationDto saved = service.create(dto);
        URI location = URI.create("/api/organizations/" + saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizationDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizationDto> update(@PathVariable Long id, @Valid @RequestBody OrganizationDto dto) {
        log.info("com/lab1/lab1/dto");
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<OrganizationDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.list(null,null,pageable));
    }
}
