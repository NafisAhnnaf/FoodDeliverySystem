package com.swe4302.models;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public final class Restaurant {

    private String id;
    private String name;
    private String address;
    private String phone;
    private String ownerUserId;
    @JacksonXmlElementWrapper(localName = "schedule")
    @JacksonXmlProperty(localName = "openHours")
    private List<OpenHours> schedule = new ArrayList<>(); // Private and initialized

    protected Restaurant() {
        this.id = UUID.randomUUID().toString();
    }

    public Restaurant(String name, String address, String phone, String ownerUserId) {
        this.id = UUID.randomUUID().toString();
        setName(name);
        setAddress(address);
        setPhone(phone);
        setOwnerUserId(ownerUserId);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant name cannot be empty");
        }
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant address cannot be empty");
        }
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant phone cannot be empty");
        }
        this.phone = phone;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        if (ownerUserId == null || ownerUserId.trim().isEmpty()) {
            throw new IllegalArgumentException("Owner user ID cannot be empty");
        }
        this.ownerUserId = ownerUserId;
    }

    // public List<Menu> getMenus() {
    //     return Collections.unmodifiableList(menus);
    // }
    // public Menu getMenuById(String id) {
    //     for (Menu menu : menus) {
    //         if (menu.getId().equals(id)) {
    //             return menu;
    //         }
    //     }
    //     return null;
    // }
    // public void addMenu(Menu menu) {
    //     if (menu == null) {
    //         throw new IllegalArgumentException("Menu cannot be null");
    //     }
    //     this.menus.add(menu);
    // }
    // public boolean removeMenu(Menu menu) {
    //     return this.menus.remove(menu);
    // }
    // public boolean removeMenuById(String id) {
    //     Menu menu = getMenuById(id);
    //     if (menu == null) {
    //         return false;
    //     }
    //     return menus.remove(menu);
    // }
    // @JsonIgnore
    // public int getMenuCount() {
    //     return menus.size();
    // }
    // @JsonIgnore
    // public Menu getMenu(String id) {
    //     return getMenuById(id);
    // }
    // public void deleteMenu(Menu menu) {
    //     removeMenu(menu);
    // }
    public void setSchedule(List<OpenHours> schedule) {
        if (schedule == null) {
            throw new IllegalArgumentException("Schedule cannot be null");
        }
        this.schedule = new ArrayList<>(schedule); // Defensive copy
    }

    public List<OpenHours> getSchedule() {
        return Collections.unmodifiableList(schedule);
    }

    @JsonIgnore
    public boolean isOpen() {
        LocalDateTime now = LocalDateTime.now();

        DayOfWeek currentDay = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        if (schedule == null) {
            return false;
        }

        for (OpenHours hours : schedule) {
            if (hours.isNow(currentDay, currentTime)) {
                return true;
            }
        }

        return false;
    }

}
