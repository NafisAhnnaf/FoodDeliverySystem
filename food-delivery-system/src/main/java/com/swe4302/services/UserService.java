package com.swe4302.services;

import java.util.ArrayList;
import java.util.List;

import com.swe4302.models.User;
import com.swe4302.models.UserLevel;
import com.swe4302.repositories.XmlRepository;

public class UserService {

    private final XmlRepository<User> userRepo = new XmlRepository<>(User.class, "users.xml");

    public List<User> getAllUsers() throws Exception {
        // Simply load everything from the XML via the repository
        List<User> users = userRepo.loadAll();

        if (users == null || users.isEmpty()) {
            return new ArrayList<>();
        }

        return users;
    }

    /**
     * Updates the address for a specific user.
     */
    public void updateUserAddress(String userId, String newAddress) throws Exception {
        List<User> users = userRepo.loadAll();
        boolean isUpdated = false;

        for (User user : users) {
            if (user.getId().equals(userId)) {
                user.setAddress(newAddress); // Assumes you have a setAddress() in your User model
                isUpdated = true;
                break;
            }
        }

        if (!isUpdated) {
            throw new Exception("Update failed: User could not be found.");
        }

        // Save the mutated list back to the XML database
        userRepo.saveAll(users);
    }

    /**
     * Updates the phone number for a specific user.
     */
    public void updateUserPhone(String userId, String newPhone) throws Exception {
        List<User> users = userRepo.loadAll();
        boolean isUpdated = false;

        for (User user : users) {
            if (user.getId().equals(userId)) {
                user.setPhone(newPhone); // Assumes you have a setPhone() in your User model
                isUpdated = true;
                break;
            }
        }

        if (!isUpdated) {
            throw new Exception("Update failed: User could not be found.");
        }

        userRepo.saveAll(users);
    }

    public void updateUserTierByEmail(String email, String newTier) throws Exception {
        // 1. Load all users from the XML file
        List<User> users = userRepo.loadAll();

        // 2. Find the specific user
        User targetUser = users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new Exception("User with email " + email + " not found."));

        // 3. Update the tier (converting String to Enum)
        try {
            targetUser.setTier(UserLevel.valueOf(newTier.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new Exception("Invalid tier level: " + newTier);
        }

        // 4. Save the updated list back to users.xml
        userRepo.saveAll(users);
    }

    public UserLevel getUserTier(String userId) throws Exception {
        List<User> users = userRepo.loadAll();
        UserLevel lvl = users.stream()
                .filter(u -> u.getId().equals(userId))
                .map(User::getTier) // Assuming User.java has getTier()
                .findFirst()
                .orElseThrow(() -> new Exception("User not found"));

        if (lvl == null) {
            throw new Exception("Fetch failed: User account not found.");
        }
        return lvl;
    }
    // You can add more user-specific business logic here!
    // e.g., changing passwords, deleting accounts, etc.
}
