package com.lab1.lab1.imports;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportOperationRepository extends JpaRepository<ImportOperation, Long> {
    Page<ImportOperation> findByUsernameOrderByIdDesc(String username, Pageable pageable);
    Page<ImportOperation> findAllByOrderByIdDesc(Pageable pageable);
}
