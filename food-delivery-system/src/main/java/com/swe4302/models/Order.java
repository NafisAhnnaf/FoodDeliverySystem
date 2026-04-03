package com.swe4302.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.swe4302.utils.OrderLine;

@JacksonXmlRootElement(localName = "order")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {

    public enum OrderStatus {
        CREATED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }

    private String id;
    private String customerId;
    private String restaurantId;
    private String restaurantName;
    
    @JacksonXmlElementWrapper(localName = "items")
    @JacksonXmlProperty(localName = "orderLine")
    private List<OrderLine> items = new ArrayList<>();
    
    private Coupon coupon;
    private String paymentId;
    private String deliveryId;
    private String deliveryAddress;
    private OrderStatus status;

    // Financial Snapshots (Persisted to XML)
    private double subtotal;
    private double discountAmount;
    private double total;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    protected Order() {
        // Essential for Jackson
    }

    public Order(String customerId, String restaurantId, String restaurantName, String deliveryAddress) {
        this.id = UUID.randomUUID().toString();
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.deliveryAddress = deliveryAddress;
        this.status = OrderStatus.CREATED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Captures the current state of the order and freezes the prices.
     * This should be called in the Service layer before saving.
     */
    public void calculateFinalAmounts() {
        this.subtotal = items.stream()
                .mapToDouble(i -> i.getItem().getPrice() * i.getQuantity())
                .sum();
        
        this.discountAmount = (this.coupon == null) ? 0 : this.coupon.calculateDiscount(this.subtotal);
        this.total = this.subtotal - this.discountAmount;
        this.touch();
    }

    public void addItem(MenuItem item, int quantity) {
        if (status == OrderStatus.CANCELLED || status == OrderStatus.DELIVERED) 
            throw new IllegalStateException("Finalized orders cannot be modified");
        
        boolean found = false;
        for (OrderLine line : items) {
            if (line.getItem().getId().equals(item.getId())) {
                line.setQuantity(line.getQuantity() + quantity);
                found = true;
                break;
            }
        }
        if (!found) {
            items.add(new OrderLine(item, quantity));
        }
        
        // Recalculate amounts whenever items change
        calculateFinalAmounts();
    }

    private void touch() { 
        this.updatedAt = LocalDateTime.now(); 
    }

    // --- Standard Getters and Setters ---
    // Jackson and SOAP need these to map the XML fields to the class

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public List<OrderLine> getItems() { return items; }
    public void setItems(List<OrderLine> items) { this.items = items; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getDeliveryId() { return deliveryId; }
    public void setDeliveryId(String deliveryId) { this.deliveryId = deliveryId; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Coupon getCoupon() { return coupon; }
    public void setCoupon(Coupon coupon) { this.coupon = coupon; }
}