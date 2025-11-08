package com.lab1.lab1.dto;

import com.lab1.lab1.model.Organization;
import com.lab1.lab1.model.Person;
import com.lab1.lab1.model.enums.Status;
import com.lab1.lab1.model.Worker;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.ZonedDateTime;

public class WorkerDto {

    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotNull(message = "Coordinates cannot be null")
    private CoordinatesDto coordinates;

    private ZonedDateTime creationDate; // автогенерация на сервере

    @NotNull(message = "Organization ID cannot be null")
    @Positive(message = "Organization ID must be positive")
    private Long organizationId;

    @NotNull(message = "Salary must be greater than 0")
    @Positive(message = "Salary must be positive")
    private Double salary;

    @Positive(message = "Rating must be greater than 0")
    private Integer rating;

    @NotNull(message = "Start date cannot be null")
    private ZonedDateTime startDate;

    private LocalDate endDate;

    private Status status;

    @Positive(message = "Person ID must be positive")
    private Long personId; // может быть null


    public Worker toEntity(Organization org, Person person) {
        Worker w = new Worker();
        w.setName(this.name);
        w.setCoordinates(this.coordinates.toEntity());
        w.setOrganization(org);
        w.setSalary(this.salary);
        w.setRating(this.rating);
        w.setStartDate(this.startDate);
        w.setEndDate(this.endDate);
        w.setStatus(this.status);
        w.setPerson(person);
        return w;
    }

    public static WorkerDto fromEntity(Worker w) {
        WorkerDto dto = new WorkerDto();
        dto.id = w.getId();
        dto.name = w.getName();
        if (w.getCoordinates() != null) dto.coordinates = CoordinatesDto.fromEntity(w.getCoordinates());
        dto.salary = w.getSalary();
        dto.rating = w.getRating();
        dto.startDate = w.getStartDate();
        dto.endDate = w.getEndDate();
        dto.status = w.getStatus();
        if (w.getOrganization() != null) dto.organizationId = w.getOrganization().getId();
        if (w.getPerson() != null) dto.personId = w.getPerson().getId();
        return dto;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CoordinatesDto getCoordinates() { return coordinates; }
    public void setCoordinates(CoordinatesDto coordinates) { this.coordinates = coordinates; }
    public ZonedDateTime getCreationDate() { return creationDate; }
    public void setCreationDate(ZonedDateTime creationDate) { this.creationDate = creationDate; }
    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public ZonedDateTime getStartDate() { return startDate; }
    public void setStartDate(ZonedDateTime startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Long getPersonId() { return personId; }
    public void setPersonId(Long personId) { this.personId = personId; }
}
