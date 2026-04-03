package com.swe4302.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;
import com.swe4302.models.User;
import com.swe4302.repositories.XmlRepository;
import com.swe4302.utils.JwtUtil;

public class AuthService {

    static {
        System.setProperty("javax.xml.bind.JAXBContextFactory", "com.sun.xml.bind.v2.ContextFactory");
    }

    private final XmlRepository<User> userRepo = new XmlRepository<>(User.class, "users.xml");
    private static final String STATIC_SALT = "CSE4302-Final-Assignment-2026";

    public String signupUser(String fullName, String email, String phone, String address, String password) throws Exception {
        List<User> users = userRepo.loadAll();

        if (users.stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(email))) {
            throw new Exception("Registration failed: Email already in use.");
        }

        String hashedPassword = hashPassword(password);
        User newUser = new User(fullName, email, phone, address, hashedPassword);

        users.add(newUser);
        userRepo.saveAll(users);
        return newUser.getId();
    }

    public String loginUser(String email, String password) throws Exception {
        List<User> users = userRepo.loadAll();
        String hashedInput = hashPassword(password);

        Optional<User> userOpt = users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email) && u.getPasswordHash().equals(hashedInput))
                .findFirst();

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return JwtUtil.generateToken(user.getId(), user.getEmail());
        } else {
            throw new Exception("Authentication failed: Invalid email or password.");
        }
    }

    // You can add loginAdmin and signupAdmin here following the exact same pattern!
    private String hashPassword(String password) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String saltedPassword = password + STATIC_SALT;
        byte[] hash = digest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
