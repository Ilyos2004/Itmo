package com.lab1.lab1.service;

import com.lab1.lab1.model.Person;
import com.lab1.lab1.repository.PersonRepository;
import com.lab1.lab1.dto.PersonDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PersonServiceImpl implements PersonService {

    private final PersonRepository repo;

    @Autowired
    public PersonServiceImpl(PersonRepository repo) {
        this.repo = repo;
    }

    @Override
    //Создаёт нового человека и сохраняет его в базе
    public PersonDto create(PersonDto dto) {
        Person p = dto.toEntity();
        repo.saveAndFlush(p);
        return PersonDto.fromEntity(p);
    }

    @Override
    //Возвращает информацию о человеке по его ID
    public PersonDto findById(Long id) {
        Person p = repo.findById(id).orElseThrow(() -> new RuntimeException("Person not found"));
        return PersonDto.fromEntity(p);
    }

    @Override
    //Обновляет данные существующего человека
    public PersonDto update(Long id, PersonDto dto) {
        Person p = repo.findById(id).orElseThrow(() -> new RuntimeException("Person not found"));
        dto.applyToEntity(p);
        Person saved = repo.saveAndFlush(p);
        return PersonDto.fromEntity(saved);
    }

    @Override
    //Удаляет запись человека по ID.
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Page<PersonDto> list(String filterField, String filterValue, Pageable pageable) {
        Page<Person> p = repo.findAll(pageable);
        return p.map(PersonDto::fromEntity);
    }
}
