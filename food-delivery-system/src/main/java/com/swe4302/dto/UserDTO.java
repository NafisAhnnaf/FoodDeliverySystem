package com.swe4302.dto;

import com.swe4302.models.User;

public class UserDTO {
    public String fullName;
    public String email;
    public String phone;
    public String address;
    public String tier;

    // Constructor that maps the internal Model to the public DTO
    public UserDTO(User user) {
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.tier = user.getTier().toString();
    }

    // JAX-WS needs a no-arg constructor
    public UserDTO() {
    }
}
