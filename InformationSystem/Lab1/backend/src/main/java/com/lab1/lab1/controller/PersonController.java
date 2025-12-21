package com.lab1.lab1.controller;

import com.lab1.lab1.dto.OrganizationDto;
import com.lab1.lab1.service.PersonService;
import com.lab1.lab1.dto.PersonDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private static final Logger log = LogManager.getLogger(PersonController.class);
    private final PersonService service;

    @Autowired
    public PersonController(PersonService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<PersonDto> create(@Valid @RequestBody PersonDto dto) {
        PersonDto saved = service.create(dto);
        URI location = URI.create("/api/persons/" + saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDto> update(@PathVariable Long id, @Valid @RequestBody PersonDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<PersonDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.list(null,null,pageable));
    }
}
