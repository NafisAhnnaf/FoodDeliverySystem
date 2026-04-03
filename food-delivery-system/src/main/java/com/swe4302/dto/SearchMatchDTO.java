package com.swe4302.dto;

public class SearchMatchDTO {

    public String restaurantId;
    public String matchText; // e.g., "Kebab" or "Spicy Dhaka Kebab"

    public SearchMatchDTO() {
    }

    public SearchMatchDTO(String id, String text) {
        this.restaurantId = id;
        this.matchText = text;
    }
}
