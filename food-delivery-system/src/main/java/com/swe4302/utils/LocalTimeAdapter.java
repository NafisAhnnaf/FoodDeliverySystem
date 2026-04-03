package com.swe4302.utils;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import jakarta.xml.bind.annotation.adapters.XmlAdapter;

public class LocalTimeAdapter extends XmlAdapter<String, LocalTime> {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public LocalTime unmarshal(String v) throws Exception {
        return (v == null || v.isEmpty()) ? null : LocalTime.parse(v, formatter);
    }

    @Override
    public String marshal(LocalTime v) throws Exception {
        return (v == null) ? null : v.format(formatter);
    }
}
