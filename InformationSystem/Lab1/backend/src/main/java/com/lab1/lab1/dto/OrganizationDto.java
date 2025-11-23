package com.lab1.lab1.dto;

import com.lab1.lab1.model.*;
import com.lab1.lab1.model.enums.OrganizationType;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Data
public class OrganizationDto {

    private static final Logger log = LogManager.getLogger(OrganizationDto.class);
    private Long id;
    private String orgName;

    private String street;

    @Positive
    private Integer annualTurnover;

    @Positive
    private Long employeesCount;

    @Positive
    private Integer rating;

    private OrganizationType type;


    public static OrganizationDto fromEntity(Organization org) {
        log.info("fromEntity");
        OrganizationDto dto = new OrganizationDto();
        dto.id = org.getId();
        if (org.getOfficialAddress() != null) dto.street = org.getOfficialAddress().getStreet();
        dto.annualTurnover = org.getAnnualTurnover();
        dto.employeesCount = org.getEmployeesCount();
        dto.rating = org.getRating();
        dto.orgName = org.getOrgName();
        dto.type = org.getType();
        return dto;
    }

    public Organization toEntity() {
        log.info("toEntity");

        Organization org = new Organization();
        Address addr = new Address();
        addr.setStreet(this.street);
        org.setOfficialAddress(addr);
        org.setAnnualTurnover(this.annualTurnover);
        org.setEmployeesCount(this.employeesCount);
        org.setRating(this.rating);
        org.setType(this.type);
        
        org.setOrgName(this.orgName);
        return org;
    }

    public void applyToEntity(Organization org) {
        log.info(this.annualTurnover);

        if (this.street != null) {
            if (org.getOfficialAddress() == null) org.setOfficialAddress(new Address());
            org.getOfficialAddress().setStreet(this.street);
        }
        if (this.annualTurnover != null) { org.setAnnualTurnover(this.annualTurnover); }
        if (this.annualTurnover == null){
            org.setAnnualTurnover(org.getAnnualTurnover());
        }
        if (this.employeesCount != null) { org.setEmployeesCount(this.employeesCount); }
        else{
            org.setEmployeesCount(org.getEmployeesCount());
        }
        if(this.orgName != null) {
        	org.setOrgName(org.getOrgName());
        }
        	
        if (this.rating != null) { org.setRating(this.rating); }
        else{
            org.setRating(org.getRating());
        }
        if (this.type != null) { org.setType(this.type); }
        else { org.setType(org.getType()); }
    }
}
