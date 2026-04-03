package com.swe4302.controllers;

import com.swe4302.services.AuthService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

@WebService(serviceName = "AuthService")
public class AuthController {

    private final AuthService authService = new AuthService();

    @WebMethod(operationName = "registerUser")
    public String signupUser(
            @WebParam(name = "fullName") String fullName,
            @WebParam(name = "email") String email,
            @WebParam(name = "phone") String phone,
            @WebParam(name = "address") String address,
            @WebParam(name = "password") String password) {
        try {
            return authService.signupUser(fullName, email, phone, address, password);
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }

    @WebMethod(operationName = "loginUser")
    public String loginUser(
            @WebParam(name = "email") String email,
            @WebParam(name = "password") String password) {
        try {
            return authService.loginUser(email, password);
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }
}
