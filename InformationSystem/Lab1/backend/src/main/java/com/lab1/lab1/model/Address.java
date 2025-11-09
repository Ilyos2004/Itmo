package com.lab1.lab1.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
    private String street;
    public Address() {}
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
}
