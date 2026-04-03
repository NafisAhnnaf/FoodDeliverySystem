package com.swe4302.dto;

import java.util.List;

import com.swe4302.models.Menu;
import com.swe4302.models.OpenHours;
import com.swe4302.models.Restaurant;

public class RestaurantOwnerDTO {

    // CHANGE TO PRIVATE to avoid "two properties of the same name" error
    private String id;
    private String name;
    private String address;
    private String phone;
    private List<Menu> menus;
    private boolean isOpen;
    private List<OpenHours> schedule;

    // Default constructor for JAX-WS
    public RestaurantOwnerDTO() {
    }

    public RestaurantOwnerDTO(Restaurant res, List<Menu> menus) {
        this.id = res.getId();
        this.name = res.getName();
        this.address = res.getAddress();
        this.phone = res.getPhone();
        this.menus = menus;
        this.isOpen = res.isOpen();
        this.schedule = res.getSchedule();
    }

    // Standard Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public List<Menu> getMenus() {
        return menus;
    }

    public boolean isIsOpen() {
        return isOpen;
    }

    public List<OpenHours> getSchedule() {
        return schedule;
    }

    // Standard Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }

    public void setIsOpen(boolean isOpen) {
        this.isOpen = isOpen;
    }

    public void setSchedule(List<OpenHours> schedule) {
        this.schedule = schedule;
    }
}
