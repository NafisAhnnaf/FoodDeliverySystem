package com.swe4302.models;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import java.util.UUID;

@JacksonXmlRootElement(localName = "review")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)

public class Review {

    private String id;
    private String restaurantId;
    private String userId;
    private String content;
    private int foodRating; // 1-5

    public Review() {
    }

    public Review(String restaurantId, String userId, String content, int rating) {
        this.id = UUID.randomUUID().toString();
        this.restaurantId = restaurantId;
        this.userId = userId;
        this.content = content;
        this.foodRating = rating;
    }

    // Getters
    public String getRestaurantId() {
        return restaurantId;
    }

    public String getContent() {
        return content;
    }

    public int getFoodRating() {
        return foodRating;
    }

    public String getId() {
        return this.id;
    }

    public String getUserId() {
        return this.userId;
    }
}
