package com.lab1.lab1.model;

import com.lab1.lab1.model.enums.OrganizationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "organizations")
public class Organization {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String orgName;

    @Embedded
    private Address officialAddress;

    @Positive
    @Column(name = "annual_turnover", nullable = false)
    private int annualTurnover;

    @NotNull
    @Positive
    @Column(name = "employees_count", nullable = false)
    private Long employeesCount;

    @Positive
    @Column(nullable = false)
    private int rating;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Address getOfficialAddress() { return officialAddress; }
    public void setOfficialAddress(Address officialAddress) { this.officialAddress = officialAddress; }
    public int getAnnualTurnover() { return annualTurnover; }
    public void setAnnualTurnover(int annualTurnover) { this.annualTurnover = annualTurnover; }
    public Long getEmployeesCount() { return employeesCount; }
    public void setEmployeesCount(Long employeesCount) { this.employeesCount = employeesCount; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String name) {
		this.orgName = name;
	}
}

