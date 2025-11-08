package com.lab1.lab1.util;

import com.lab1.lab1.model.Worker;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Expression;

public class WorkerSpecifications {
    public static Specification<Worker> partialMatch(String field, String value) {
        return (root, query, cb) -> {
            if (field == null || value == null || value.isBlank()) return cb.conjunction();
            try {
                Path<String> p = root.get(field);
                return cb.like(cb.lower(p.as(String.class)), "%" + value.toLowerCase() + "%");
            } catch (IllegalArgumentException ex) {
                // field not present -> no filtering
                return cb.conjunction();
            }
        };
    }
}
