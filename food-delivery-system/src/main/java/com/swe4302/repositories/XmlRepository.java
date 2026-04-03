package com.swe4302.repositories;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public class XmlRepository<T> {

    private final Class<T> type;
    private final String filePath;
    private final XmlMapper xmlMapper;

    public XmlRepository(Class<T> type, String fileName) {
        this.type = type;
        this.filePath = "data/" + fileName;

        // Initialize the Jackson XML Mapper once per repository
        this.xmlMapper = new XmlMapper();

        // Register the Java Time module to natively handle your LocalDateTime fields in Order and Coupon
        this.xmlMapper.registerModule(new JavaTimeModule());

        // Disable writing dates as timestamps so they appear as readable ISO-8601 strings in the XML
        this.xmlMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Enable pretty-printing (equivalent to JAXB_FORMATTED_OUTPUT)
        this.xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    public void saveAll(List<T> items) throws IOException {
        File file = new File(filePath);
        if (file.getParentFile() != null && !file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }

        // Jackson writes the List directly. No Wrapper class needed!
        xmlMapper.writeValue(file, items);
    }

    public List<T> loadAll() throws IOException {
        File file = new File(filePath);
        if (!file.exists() || file.length() == 0) {
            return new ArrayList<>();
        }

        // Jackson reconstructs the generic List natively using TypeFactory
        try {
            List<T> result = xmlMapper.readValue(file, xmlMapper.getTypeFactory().constructCollectionType(List.class, type));
            System.out.println("DEBUG: Loaded " + result.size() + " items for type " + type.getSimpleName());
            return result;
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR loading " + type.getSimpleName() + ": " + e.getMessage());
            e.printStackTrace(); // This will tell you EXACTLY which field is breaking the load
            return new ArrayList<>();
        }
    }
}
