package com.swe4302.controllers;

import java.util.List;
import java.util.stream.Collectors;

import com.swe4302.dto.UserDTO;
import com.swe4302.middlewares.AuthGuard;
import com.swe4302.models.User;
import com.swe4302.models.UserLevel; // You can create this for User CRUD operations
import com.swe4302.services.UserService;

import jakarta.annotation.Resource;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.xml.ws.WebServiceContext;

@WebService(serviceName = "UserService")
public class UserController {

    @Resource
    private WebServiceContext context;
    private final UserService userService = new UserService();

    @WebMethod(operationName = "getProfile")
    public UserDTO getProfile() throws Exception {
        // 1. The Guard handles the header, the JWT math, and the XML DB lookup!
        User authenticatedUser = AuthGuard.userGuard(context);

        // 2. You now have the actual User object to do whatever you want with.
        return new UserDTO(authenticatedUser);
    }

    @WebMethod(operationName = "getAllUsers")
    public List<UserDTO> getAllUsers() throws Exception {
        try {
            // 1. Security Check: Only DEVELOPER tier can call this
            // This will throw an Exception if the token belongs to a lower tier
            // AuthGuard.devGuard(context);

            List<User> internalUsers = userService.getAllUsers();

            // Transform into "Clean" DTOs
            return internalUsers.stream()
                    .map(UserDTO::new)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            // Log the error and rethrow for the SOAP Fault
            System.err.println("DevDashboard Error: " + e.getMessage());
            throw new Exception("FORBIDDEN: " + e.getMessage());
        }
    }

    @WebMethod(operationName = "updateAddress")
    public String updateAddress(@WebParam(name = "newAddress") String newAddress) throws Exception {
        User user = AuthGuard.userGuard(context);
        userService.updateUserAddress(user.getId(), newAddress); // Actually save it!
        return "Address updated successfully";
    }

    @WebMethod(operationName = "fetchUserData")
    public User fetchUserData() throws Exception {
        // userGuard validates the token and returns the logged-in User
        return AuthGuard.userGuard(context);
    }

    @WebMethod(operationName = "updateUserTierByEmail")
    public String updateUserTierByEmail(
            @WebParam(name = "email") String email,
            @WebParam(name = "newTier") String newTier) throws Exception {

        // Ensure only a Developer can execute this (Uncomment once your tier is set)
        // AuthGuard.devGuard(context); 
        try {
            userService.updateUserTierByEmail(email, newTier);
            return "SUCCESS: User " + email + " is now " + newTier;
        } catch (Exception e) {
            throw new Exception("UPDATE_FAILED: " + e.getMessage());
        }
    }

    @WebMethod(operationName = "getUserTier")
    public UserLevel getUserTier() throws Exception {
        // 1. Authenticate the user (this uses JwtUtil and XmlRepo internally)
        User user = AuthGuard.userGuard(context);

        // 2. Fetch the tier from the service
        return userService.getUserTier(user.getId());
    }
}
