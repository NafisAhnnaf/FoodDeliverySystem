package com.swe4302.models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
// @JacksonXmlRootElement(localName = "menu")
public class Menu {

    private String id;
    private String name;
    private String description;
    private String restaurantId;
    @JacksonXmlElementWrapper(localName = "menuItems")
    @JacksonXmlProperty(localName = "menuItem")
    private List<MenuItem> menuItems = new ArrayList<>();

    public Menu() {
        this.id = UUID.randomUUID().toString();
    }

    public Menu(String name, String description, String restaurantId) {
        this();
        setName(name);
        setDescription(description);
        setRestaurantId(restaurantId);
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
        // Defensive: prevent the crash during deserialization if name is missing
        if (name == null || name.trim().isEmpty()) {
            this.name = "Untitled Section";
            return;
        }
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public void setDescription(String description) {
        this.description = description == null ? "" : description.trim();
    }

    public List<MenuItem> getMenuItems() {
        return menuItems;
    }

    public void addMenuItem(MenuItem item) {
        if (item != null) {
            menuItems.add(item);
        }
    }

    public void setMenuItems(List<MenuItem> menuItems) {
        this.menuItems = menuItems != null ? menuItems : new ArrayList<>();
    }

    @JsonIgnore // Prevents <itemCount> tag in XML
    public int getItemCount() {
        return menuItems.size();
    }

    @JsonIgnore // Prevents <empty> tag in XML
    public boolean isEmpty() {
        return menuItems.isEmpty();
    }
}
