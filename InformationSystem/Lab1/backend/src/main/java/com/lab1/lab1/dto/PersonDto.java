package com.lab1.lab1.dto;

import com.lab1.lab1.model.Location;
import com.lab1.lab1.model.Person;
import com.lab1.lab1.model.enums.Color;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class PersonDto {

    private Long id;

    private Color eyeColor;
    
    private String perName;


    private Color hairColor;


    private LocationDto location;


    private LocalDateTime birthday;

    @Positive
    private Long height;

    @Positive
    private Double weight;

    @Size(max = 47)
    private String passportID;

    @Data
    public static class LocationDto {

        private Double x;
        private int y;

        private Double z;

        private String name;

        public Location toEntity() {
            Location loc = new Location();
            loc.setX(x);
            loc.setY(y);
            loc.setZ(z);
            loc.setName(name);
            return loc;
        }

        public static LocationDto fromEntity(Location loc) {
            LocationDto dto = new LocationDto();
            dto.x = loc.getX();
            dto.y = loc.getY();
            dto.z = loc.getZ();
            dto.name = loc.getName();
            return dto;
        }

        public Double getX() { return x; }
        public void setX(Double x) { this.x = x; }
        public int getY() { return y; }
        public void setY(int y) { this.y = y; }
        public Double getZ() { return z; }
        public void setZ(Double z) { this.z = z; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static PersonDto fromEntity(Person p) {
        PersonDto dto = new PersonDto();
        dto.id = p.getId();
        dto.eyeColor = p.getEyeColor();
        dto.hairColor = p.getHairColor();
        if (p.getLocation() != null) dto.location = LocationDto.fromEntity(p.getLocation());
        dto.birthday = p.getBirthday();
        dto.height = p.getHeight();
        dto.weight = p.getWeight();
        dto.perName = p.getPerName();
        dto.passportID = p.getPassportID();
        return dto;
    }

    public Person toEntity() {
        Person p = new Person();
        p.setEyeColor(this.eyeColor);
        p.setHairColor(this.hairColor);
        if (this.location != null) p.setLocation(this.location.toEntity());
        p.setBirthday(this.birthday);
        p.setHeight(this.height);
        p.setWeight(this.weight);
        p.setPerName(this.perName);
        p.setPassportID(this.passportID);
        return p;
    }

    public void applyToEntity(Person p) {
    	if (this.perName != null) { p.setPerName(this.perName); }
        else { p.setPerName(p.getPerName()); }
        if (this.eyeColor != null) { p.setEyeColor(this.eyeColor); }
        else { p.setEyeColor(p.getEyeColor()); }
        if (this.hairColor != null) p.setHairColor(this.hairColor);
        else { p.setHairColor(p.getHairColor()); }
        if (this.location != null) p.setLocation(this.location.toEntity());
        else { p.setLocation(p.getLocation()); }
        if (this.birthday != null) p.setBirthday(this.birthday);
        else { p.setBirthday(p.getBirthday()); }
        if (this.height != null) p.setHeight(this.height);
        else { p.setHeight(p.getHeight()); }
        if (this.weight != null) p.setWeight(this.weight);
        else { p.setWeight(p.getWeight()); }
        if (this.passportID != null) p.setPassportID(this.passportID);
        else { p.setPassportID(p.getPassportID()); }
    }
}
