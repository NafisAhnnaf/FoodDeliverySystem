package com.swe4302.models;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

@JacksonXmlRootElement(localName = "rider")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Rider {
    private String id;
    private String userId;      // Reference to the User Account
    private String fullName;    // Cached for quick display
    private String phone;       // Cached for customer contact
    private String licenseNumber;
    private boolean isAvailable = true;

    // Default constructor required for Jackson/JAXB
    public Rider() {}

    public Rider(String userId, String fullName, String phone, String licenseNumber) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.isAvailable = true;
    }

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}