package com.swe4302.models;

import java.time.DayOfWeek;
import java.time.LocalTime;

import com.swe4302.utils.LocalTimeAdapter;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

/**
 * Represents the opening and closing times for a restaurant on a specific day.
 * Updated to support JAX-B/Jackson XML deserialization.
 */
@XmlAccessorType(XmlAccessType.FIELD)
public final class OpenHours {

    private DayOfWeek day;
    @XmlJavaTypeAdapter(LocalTimeAdapter.class)
    private LocalTime opensAt;
    @XmlJavaTypeAdapter(LocalTimeAdapter.class)
    private LocalTime closesAt;

    /**
     * MANDATORY: No-argument constructor. Required by JAX-B (Glassfish) and
     * Jackson to instantiate the object before populating fields from XML.
     */
    public OpenHours() {
    }

    /**
     * Parameterized constructor for manual object creation.
     */
    public OpenHours(DayOfWeek day, LocalTime opensAt, LocalTime closesAt) {
        if (day == null || opensAt == null || closesAt == null) {
            throw new IllegalArgumentException("Day and times cannot be null");
        }
        if (opensAt.isAfter(closesAt)) {
            throw new IllegalArgumentException("Opening time must be before closing time");
        }
        this.day = day;
        this.opensAt = opensAt;
        this.closesAt = closesAt;
    }

    // --- Getters ---
    public DayOfWeek getDay() {
        return day;
    }

    public LocalTime getOpensAt() {
        return opensAt;
    }

    public final LocalTime getClosesAt() {
        return closesAt;
    }

    // --- Setters (Required for XML Mapping) ---
    public void setDay(DayOfWeek day) {
        this.day = day;
    }

    public void setOpensAt(LocalTime opensAt) {
        this.opensAt = opensAt;
    }

    public void setClosesAt(LocalTime closesAt) {
        this.closesAt = closesAt;
    }

    /**
     * Business logic to check if the provided time falls within these hours.
     */
    public boolean isNow(DayOfWeek currentDay, LocalTime currentTime) {
        if (this.day != currentDay) {
            return false;
        }
        // Check if currentTime is within [opensAt, closesAt)
        return !currentTime.isBefore(opensAt) && currentTime.isBefore(closesAt);
    }

    @Override
    public String toString() {
        return day + ": " + opensAt + " - " + closesAt;
    }
}
