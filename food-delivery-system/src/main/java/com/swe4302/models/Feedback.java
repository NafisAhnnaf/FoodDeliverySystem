package com.swe4302.models;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import java.time.LocalDateTime;
import java.util.UUID;

@JacksonXmlRootElement(localName = "feedback")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Feedback {

    private String id;
    private String orderId;
    private String userId;
    private String comment;
    private double rating; // 1-5
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public Feedback() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Feedback(String orderId, String userId, String comment, double rating) {
        this.id = UUID.randomUUID().toString();
        this.orderId = orderId;
        this.userId = userId;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = java.time.LocalDateTime.now();
        this.updatedAt = java.time.LocalDateTime.now();
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public String getComment() {
        return comment;
    }

    public double getDeliveryRating() {
        return this.rating;
    }

    public String getId() {
        return this.id;
    }
}
