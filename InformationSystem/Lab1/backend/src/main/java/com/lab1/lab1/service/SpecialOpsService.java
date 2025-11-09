package com.lab1.lab1.service;

import com.lab1.lab1.model.Worker;
import com.lab1.lab1.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SpecialOpsService {

    private final WorkerRepository workerRepo;

    @Autowired
    public SpecialOpsService(WorkerRepository workerRepo) {
        this.workerRepo = workerRepo;
    }

    // Количество работников с указанным рейтингом
    public long countByRating(int rating) {
        return workerRepo.countByRating(rating);
    }

    // Список работников, startDate < заданного
    public List<Worker> workersWithStartBefore(ZonedDateTime zdt) {
        return workerRepo.findByStartDateBefore(zdt);
    }

    // Уникальные ID person всех работников
    public List<Long> uniquePersonIds() {
        return workerRepo.findAll().stream()
                .map(Worker::getPerson)
                .filter(p -> p != null)
                .map(p -> p.getId())
                .distinct()
                .collect(Collectors.toList());
    }

    // Уволить работника
    public void fireWorkerById(Long id) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        w.setStatus(null); // или Status.PROBATION
        workerRepo.save(w);
    }

    // Проиндексировать зарплату
    public void indexSalary(Long id, double factor) {
        Worker w = workerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        w.setSalary(w.getSalary() * factor);
        workerRepo.save(w);
    }
}
