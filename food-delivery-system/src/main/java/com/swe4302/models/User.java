package com.swe4302.models;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

@JacksonXmlRootElement(localName = "user")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class User {

    @JacksonXmlProperty(localName = "id")
    private String id;

    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String passwordHash;
    private UserLevel userLevel = UserLevel.USER; // Default to USER

// MANDATORY: JAXB requires a public or protected no-argument constructor
    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String fullName, String email, String phone, String address, String passwordHash) {
        this(); // Call the no-arg constructor to get a UUID
        setFullName(fullName);
        setEmail(email);
        setPhone(phone);
        setAddress(address);
        setPasswordHash(passwordHash);
    }

    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty() || email.indexOf('@') < 1) {
            throw new IllegalArgumentException("Invalid email address");
        }
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address cannot be empty");
        }
        this.address = address;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public void updateContactDetails(String email, String phone, String address) {
        setEmail(email);
        setPhone(phone);
        setAddress(address);
    }

    public void setTier(UserLevel level) {
        this.userLevel = level;
    }

    public UserLevel getTier() {
        return this.userLevel;
    }

    @Override
    public String toString() {
        return "User{"
                + "id='" + id + '\''
                + ", fullName='" + fullName + '\''
                + ", email='" + email + '\''
                + '}';
    }

}
