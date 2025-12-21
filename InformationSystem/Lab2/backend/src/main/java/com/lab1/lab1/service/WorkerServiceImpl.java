package com.lab1.lab1.service;

import com.lab1.lab1.model.Organization;
import com.lab1.lab1.model.Person;
import com.lab1.lab1.model.Worker;
import com.lab1.lab1.repository.OrganizationRepository;
import com.lab1.lab1.repository.PersonRepository;
import com.lab1.lab1.repository.WorkerRepository;
import com.lab1.lab1.dto.WorkerDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkerServiceImpl implements WorkerService {

    private final WorkerRepository workerRepo;
    private final OrganizationRepository orgRepo;
    private final PersonRepository personRepo;

    @Autowired
    public WorkerServiceImpl(WorkerRepository workerRepo,
                             OrganizationRepository orgRepo,
                             PersonRepository personRepo) {
        this.workerRepo = workerRepo;
        this.orgRepo = orgRepo;
        this.personRepo = personRepo;
    }

    @Override
    //Создаёт нового работника и связывает его с нужной организацией и человеком
    public WorkerDto create(WorkerDto dto) {
        if (workerRepo.existsByPersonId(dto.getPersonId())) {
            throw new RuntimeException("This person already has a job");
        }

        Organization org = orgRepo.findById(dto.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        Person person = null;
        if (dto.getPersonId() != null) {
            person = personRepo.findById(dto.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Person not found"));
        }

        double minSalary = org.getAnnualTurnover() * 0.10;

        if (dto.getSalary() < minSalary) {
            throw new RuntimeException("Salary must be at least 10% of organization's annual turnover");
        }

        Worker w = dto.toEntity(org, person);
        workerRepo.save(w);
        return WorkerDto.fromEntity(w);
    }

    @Override
    //поиск работника по ID
    public WorkerDto findById(Long id) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return WorkerDto.fromEntity(w);
    }

    @Override
    //обновление работника
    public WorkerDto update(Long id, WorkerDto dto) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if (dto.getName() != null) w.setName(dto.getName());
        if (dto.getCoordinates() != null) w.setCoordinates(dto.getCoordinates().toEntity());
        if (dto.getSalary() != null) w.setSalary(dto.getSalary());
        if (dto.getRating() != null) w.setRating(dto.getRating());
        if (dto.getStartDate() != null) w.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) w.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) w.setStatus(dto.getStatus());

        if (dto.getOrganizationId() != null) {
            Organization org = orgRepo.findById(dto.getOrganizationId())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            w.setOrganization(org);
        }

        if (dto.getPersonId() != null) {
            Person person = personRepo.findById(dto.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Person not found"));
            w.setPerson(person);
        } else {
            w.setPerson(null);
        }

        workerRepo.save(w);
        return WorkerDto.fromEntity(w);
    }

    @Override
    //Удаляет работника по ID
    public void delete(Long id) {
        workerRepo.deleteById(id);
    }

    @Override
    public Page<WorkerDto> list(String filterField, String filterValue, Pageable pageable) {
        Page<Worker> p = workerRepo.findAll(pageable);
        return p.map(WorkerDto::fromEntity);
    }

    @Override
    //Повышает зарплату выбранному сотруднику
    public void indexSalary(Long id, double factor) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        w.setSalary(w.getSalary() * factor);
        workerRepo.save(w);
    }

    @Override
    //увольнение
    public void fireWorkerById(Long id) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        w.setStatus(null);
        workerRepo.save(w);
    }

    @Override
    //Возвращает список разных людей, которые связаны с работниками
    public List<Long> uniquePersonIds() {
        return workerRepo.findAll().stream()
                .map(Worker::getPerson)
                .filter(p -> p != null)
                .map(Person::getId)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    //Возвращает список работников, у которых startDate раньше переданной даты
    public List<Worker> workersWithStartBefore(ZonedDateTime zdt) {
        return workerRepo.findByStartDateBefore(zdt);
    }

    @Override
    //Возвращает, сколько работников имеют указанный рейтинг
    public long countByRating(int rating) {
        return workerRepo.countByRating(rating);
    }
}