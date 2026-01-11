package com.lab1.lab1.imports;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lab1.lab1.imports.dto.WorkerImportDto;
import com.lab1.lab1.model.*;
import com.lab1.lab1.model.enums.Color;
import com.lab1.lab1.model.enums.OrganizationType;
import com.lab1.lab1.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImportService {

    private final ImportOperationRepository opsRepo;
    private final WorkerRepository workerRepo;
    private final OrganizationRepository orgRepo;
    private final PersonRepository personRepo;

    private final ObjectMapper objectMapper;
    private final Validator validator;

    public ImportService(ImportOperationRepository opsRepo,
                         WorkerRepository workerRepo,
                         OrganizationRepository orgRepo,
                         PersonRepository personRepo,
                         ObjectMapper objectMapper,
                         Validator validator) {
        this.opsRepo = opsRepo;
        this.workerRepo = workerRepo;
        this.orgRepo = orgRepo;
        this.personRepo = personRepo;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    public ImportOperation importWorkers(MultipartFile file) {
        String username = currentUsername();
        ImportOperation op = createOperation(username, ImportObjectType.WORKER);

        try {
            int added = doImportWorkersTransactional(file);
            markSuccess(op.getId(), added);
            return opsRepo.findById(op.getId()).orElseThrow();

        } catch (ImportValidationException e) {
            markFailed(op.getId(), String.join("; ", e.getErrors()));
            throw e;

        } catch (TransactionSystemException e) {
            markFailed(op.getId(), e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage());
            throw e; 

        } catch (ConstraintViolationException e) {
            markFailed(op.getId(), e.getMessage());
            throw e; 

        } catch (Exception e) {
            markFailed(op.getId(), e.getMessage() == null ? "Unknown error" : e.getMessage());
            throw new RuntimeException(e); 
        }
    }

    public Page<ImportOperation> history(Pageable pageable) {
        String username = currentUsername();
        boolean admin = currentIsAdmin();

        return admin
                ? opsRepo.findAllByOrderByIdDesc(pageable)
                : opsRepo.findByUsernameOrderByIdDesc(username, pageable);
    }

    @org.springframework.transaction.annotation.Transactional
    protected int doImportWorkersTransactional(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ImportValidationException(List.of("File is empty"));
        }

        List<WorkerImportDto> items = objectMapper.readValue(
                file.getInputStream(),
                new TypeReference<List<WorkerImportDto>>() {}
        );

        if (items == null || items.isEmpty()) {
            throw new ImportValidationException(List.of("JSON array is empty"));
        }

        List<String> errors = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            WorkerImportDto dto = items.get(i);
            Set<ConstraintViolation<WorkerImportDto>> v = validator.validate(dto);
            if (!v.isEmpty()) {
                for (var viol : v) {
                    errors.add("row " + i + ": " + viol.getPropertyPath() + " " + viol.getMessage());
                }
            }
        }
        if (!errors.isEmpty()) {
            throw new ImportValidationException(errors);
        }
        List<Worker> toSave = new ArrayList<>();

        for (int i = 0; i < items.size(); i++) {
            WorkerImportDto dto = items.get(i);


            Organization org = mapOrganization(dto.organization());

            Person person = null;
            if (dto.person() != null) {
                person = mapPerson(dto.person());
            }

            Worker w = new Worker();
            w.setName(dto.name());

            Coordinates coords = new Coordinates();
            coords.setX(dto.coordinates().x());
            coords.setY(dto.coordinates().y());
            w.setCoordinates(coords);

            w.setOrganization(org);

            w.setSalary(dto.salary());

            if (dto.rating() != null) w.setRating(dto.rating());

            w.setStartDate(dto.startDate());
            w.setEndDate(dto.endDate());

            if (dto.status() != null) {
            }

            if (person != null) w.setPerson(person);

            double minSalary = org.getAnnualTurnover() * 0.10;
            if (w.getSalary() < minSalary) {
                throw new ImportValidationException(List.of("row " + i + ": salary must be >= 10% of annualTurnover"));
            }

            toSave.add(w);
        }

        for (Worker w : toSave) {
            Organization savedOrg = orgRepo.save(w.getOrganization());
            w.setOrganization(savedOrg);

            if (w.getPerson() != null) {
                Person savedPerson = personRepo.save(w.getPerson());
                w.setPerson(savedPerson);
            }
        }

        workerRepo.saveAll(toSave);
        workerRepo.flush();

        return toSave.size();
    }
    private Organization mapOrganization(com.lab1.lab1.imports.dto.OrganizationImportDto dto) {
        Organization org = new Organization();
        org.setOrgName(dto.orgName());
        org.setAnnualTurnover(dto.annualTurnover());
        org.setEmployeesCount(dto.employeesCount());
        org.setRating(dto.rating());
        org.setType(dto.type());

        if (dto.street() != null) {
            Address addr = new Address();
            addr.setStreet(dto.street());
            org.setOfficialAddress(addr);
        }
        return org;
    }

    private Person mapPerson(com.lab1.lab1.imports.dto.PersonImportDto dto) {
        Person p = new Person();
        p.setPerName(dto.perName());
        p.setHairColor(Color.valueOf(dto.hairColor()));
        p.setEyeColor(Color.valueOf(dto.eyeColor()));

        Location loc = new Location();
        loc.setX(dto.location().x());
        loc.setY(dto.location().y());
        loc.setZ(dto.location().z());
        loc.setName(dto.location().name());
        p.setLocation(loc);

        p.setBirthday(Timestamp.valueOf(dto.birthday()).toLocalDateTime());
        if (dto.height() != null) p.setHeight(dto.height());
        if (dto.weight() != null) p.setWeight(dto.weight());
        p.setPassportID(dto.passportID());

        return p;
    }
    @org.springframework.transaction.annotation.Transactional(propagation = Propagation.REQUIRES_NEW)
    protected ImportOperation createOperation(String username, ImportObjectType type) {
        ImportOperation op = new ImportOperation();
        op.setUsername(username);
        op.setObjectType(type);
        op.setStatus(ImportStatus.RUNNING);
        op.setStartedAt(Instant.now());
        return opsRepo.save(op);
    }

    @org.springframework.transaction.annotation.Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void markSuccess(Long opId, int added) {
        ImportOperation op = opsRepo.findById(opId).orElseThrow();
        op.setStatus(ImportStatus.SUCCESS);
        op.setFinishedAt(Instant.now());
        op.setAddedCount(added);
        op.setErrorMessage(null);
        opsRepo.save(op);
    }

    @org.springframework.transaction.annotation.Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void markFailed(Long opId, String msg) {
        ImportOperation op = opsRepo.findById(opId).orElseThrow();
        op.setStatus(ImportStatus.FAILED);
        op.setFinishedAt(Instant.now());
        op.setAddedCount(null);
        op.setErrorMessage(msg);
        opsRepo.save(op);
    }

    private String currentUsername() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        return (a == null) ? "unknown" : a.getName();
    }

    private boolean currentIsAdmin() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null) return false;
        return a.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_ADMIN"));
    }
}
