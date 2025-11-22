package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.time.ZonedDateTime;

@Entity
@Table(name = "workers")
public class    Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull @NotBlank
    @Column(nullable = false)
    private String name;

    @Embedded
    @NotNull
    private Coordinates coordinates;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "creation_date", nullable = false, updatable = false)
    private Date creationDate;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Positive
    @Column(nullable = false)
    private double salary;

    @Positive
    private Integer rating;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private ZonedDateTime startDate;

    private java.time.LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @PrePersist
    public void prePersist() {
        creationDate = new Date();
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Coordinates getCoordinates() { return coordinates; }
    public void setCoordinates(Coordinates coordinates) { this.coordinates = coordinates; }
    public Date getCreationDate() { return creationDate; }
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public ZonedDateTime getStartDate() { return startDate; }
    public void setStartDate(ZonedDateTime startDate) { this.startDate = startDate; }
    public java.time.LocalDate getEndDate() { return endDate; }
    public void setEndDate(java.time.LocalDate endDate) { this.endDate = endDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Person getPerson() { return person; }
    public void setPerson(Person person) { this.person = person; }
}
