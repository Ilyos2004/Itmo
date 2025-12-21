package com.lab1.lab1.service;

import com.lab1.lab1.dto.PersonDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PersonService {
    PersonDto create(PersonDto dto);
    PersonDto findById(Long id);
    PersonDto update(Long id, PersonDto dto);
    void delete(Long id);
    Page<PersonDto> list(String filterField, String filterValue, Pageable pageable);
}
