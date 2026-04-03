package com.swe4302.dto;

import java.util.List;

import com.swe4302.models.OpenHours;
import com.swe4302.models.Restaurant;

public class RestaurantListingDTO {

    public String id;
    public String name;
    public String address;
    public boolean isOpen;
    public List<OpenHours> schedule;

    public RestaurantListingDTO(Restaurant res) {
        this.id = res.getId();
        this.name = res.getName();
        this.address = res.getAddress();
        this.isOpen = res.isOpen(); // Calculated field
        this.schedule = res.getSchedule();
    }
}
