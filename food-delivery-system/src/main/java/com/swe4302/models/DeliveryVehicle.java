// Vehicle Abstractions with PolyMorphism support for Jackson
package com.swe4302.models; 
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import jakarta.xml.bind.annotation.XmlTransient;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = Bike.class, name = "bike"),
    @JsonSubTypes.Type(value = Cycle.class, name = "cycle")
})

public abstract class DeliveryVehicle {
@XmlTransient // Prevents circular reference loops in XML
    protected Rider rider;

    public void setRider(Rider rider) {
        this.rider = rider;
    }

    public abstract String getVehicleType();
}

class Bike extends DeliveryVehicle {
    private Rider rider;
    @Override public void setRider(Rider rider) { this.rider = rider; }
    @Override public String getVehicleType() { return "Motorbike"; }
    public Rider getRider() { return rider; }
}

class Cycle extends DeliveryVehicle {
    private Rider rider;
    @Override public void setRider(Rider rider) { this.rider = rider; }
    @Override public String getVehicleType() { return "Bicycle"; }
    public Rider getRider() { return rider; }
}