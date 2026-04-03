package com.swe4302.utils;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.swe4302.models.MenuItem;

@JacksonXmlRootElement(localName = "orderLine")
public class OrderLine {

    private MenuItem item;
    private int quantity;

    // Required for XML Deserialization
    protected OrderLine() {
    }

    public OrderLine(MenuItem item, int quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    @JacksonXmlProperty(localName = "menuItem")
    public MenuItem getItem() {
        return item;
    }

    @JacksonXmlProperty(localName = "quantity")
    public int getQuantity() {
        return quantity;
    }

    public void setItem(MenuItem item) {
        this.item = item;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // // This gives you the "Pair" functionality back!
    // public double getSubtotal() {
    //     return item.getPrice() * quantity;
    // }
}
