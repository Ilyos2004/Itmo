package com.lab1.lab1.imports;

import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    // Загрузка файла (JSON) и импорт работников
    @PostMapping(value = "/workers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> importWorkers(@RequestPart("file") MultipartFile file) throws Exception {
        ImportOperation op = importService.importWorkers(file);
        return ResponseEntity.ok(op);
    }

    @GetMapping("/history")
    public ResponseEntity<Page<ImportOperation>> history(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(importService.history(pageable));
    }
}
