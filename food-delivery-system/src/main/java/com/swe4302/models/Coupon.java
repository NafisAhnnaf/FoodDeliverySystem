package com.swe4302.models;

import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
// The Abstract Base Coupon

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = PercentageCoupon.class, name = "percentage"),
    @JsonSubTypes.Type(value = FixedDiscountCoupon.class, name = "fixed")
})
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)

public abstract class Coupon {

    private final String id;
    private String code;
    private double minOrderAmount;
    private boolean active;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt; // Using LocalDateTime as requested

    public Coupon(String code, double minOrderAmount) {
        this.id = UUID.randomUUID().toString();
        this.code = (code == null) ? "" : code.trim().toUpperCase();
        this.minOrderAmount = Math.max(0, minOrderAmount);
        this.active = true;
    }

    // This is the "Strategy" method that subclasses must implement
    public abstract double calculateDiscount(double orderAmount);

    public boolean isApplicable(double orderAmount) {
        // FIX: Use isAfter() and LocalDateTime.now() correctly
        boolean notExpired = (expiresAt == null) || expiresAt.isAfter(LocalDateTime.now());
        return active && notExpired && (orderAmount >= minOrderAmount);
    }

    // Fix: Added setter for expiresAt so you can actually set an expiry date
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getCode() {
        return code;
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    public String getId() {
        return id;
    }
}

// 1. Percentage Strategy
class PercentageCoupon extends Coupon {

    private double percentage;
    private double maxDiscount;

    public PercentageCoupon(String code, double minOrderAmount, double percentage, double maxDiscount) {
        super(code, minOrderAmount);
        this.percentage = percentage;
        this.maxDiscount = maxDiscount;
    }

    @Override
    public double calculateDiscount(double orderAmount) {
        if (!isApplicable(orderAmount)) {
            return 0;
        }
        double discount = orderAmount * (percentage / 100.0);
        // Ensure discount doesn't exceed max allowed or the order amount itself
        return Math.min(Math.min(discount, maxDiscount), orderAmount);
    }
}

// 2. Fixed Amount Strategy
class FixedDiscountCoupon extends Coupon {

    private double discountAmount;

    public FixedDiscountCoupon(String code, double minOrderAmount, double discountAmount) {
        super(code, minOrderAmount);
        this.discountAmount = discountAmount;
    }

    @Override
    public double calculateDiscount(double orderAmount) {
        if (!isApplicable(orderAmount)) {
            return 0;
        }
        return Math.min(discountAmount, orderAmount);
    }
}
