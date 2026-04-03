package com.swe4302.models;

import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

// @JacksonXmlRootElement(localName = "menuItem")
public class MenuItem {

    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;

    protected MenuItem() {
        this.id = UUID.randomUUID().toString();
    }

    public MenuItem(String name, String description, double price) {
        this.id = UUID.randomUUID().toString();
        setName(name);
        setDescription(description);
        setPrice(price);
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
            throw new IllegalArgumentException("Menu item name cannot be empty");
        }
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? "" : description.trim();
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        this.stock = stock;
    }

    @JsonIgnore
    public boolean isAvailable() {
        if (stock <= 0) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "MenuItem{"
                + "id='" + id + '\''
                + ", name='" + name + '\''
                + ", price=" + price
                + ", available=" + (this.stock > 0 ? true : false)
                + '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MenuItem menuItem = (MenuItem) o;
        // Logic: Two menu items are the same if their IDs match
        return Objects.equals(id, menuItem.id);
    }

}
