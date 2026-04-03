package com.swe4302.models;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;

import java.util.UUID;

@JacksonXmlRootElement(localName = "delivery")
@XmlAccessorType(XmlAccessType.FIELD) // Tells JAX-B to look at fields, not just getters
public class Delivery {

    // public enum DeliveryStatus {
    //     PENDING, ASSIGNED,  DELIVERED, CANCELLED
    // }

    private String id;
    private String orderId;
    private String deliveryAddress;
    private Rider rider;
    // private DeliveryStatus status;

    public Delivery() {} // Required for Jackson

    public Delivery(String orderId, String deliveryAddress) {
        this.id = UUID.randomUUID().toString();
        this.orderId = orderId;
        this.deliveryAddress = deliveryAddress; 
        // this.status = DeliveryStatus.PENDING;
    }

    public void assignRider(Rider rider) {
        if (rider == null) {
            throw new IllegalArgumentException("Rider is required");
        }
        this.rider = rider;
  
        // this.status = DeliveryStatus.ASSIGNED;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    // public DeliveryStatus getStatus() { return status; }
    // public void setStatus(DeliveryStatus status) { this.status = status; }

    public Rider getRider() { return rider; }
    public void setRider(Rider rider) { this.rider = rider; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String address) { this.deliveryAddress = address; }

}



