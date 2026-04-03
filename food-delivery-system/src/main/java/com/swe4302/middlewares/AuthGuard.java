package com.swe4302.middlewares;

import java.util.List;
import java.util.Map;

import com.swe4302.models.UserLevel;
import com.swe4302.models.User;
import com.swe4302.repositories.XmlRepository;
import com.swe4302.utils.JwtUtil;

import jakarta.xml.ws.WebServiceContext;
import jakarta.xml.ws.handler.MessageContext;

public class AuthGuard {

    private static final XmlRepository<User> userRepo = new XmlRepository<>(User.class, "users.xml");

    /**
     * Extracts token directly from the WebServiceContext.
     */
    private static String extractToken(WebServiceContext context) throws Exception {
        if (context == null || context.getMessageContext() == null) {
            throw new Exception("INTERNAL ERROR: WebServiceContext is null.");
        }

        MessageContext mc = context.getMessageContext();

        @SuppressWarnings("unchecked")
        Map<String, List<String>> headers = (Map<String, List<String>>) mc.get(MessageContext.HTTP_REQUEST_HEADERS);

        if (headers == null || !headers.containsKey("Authorization")) {
            throw new Exception("UNAUTHORIZED: Missing Authorization header");
        }

        String authHeader = headers.get("Authorization").get(0);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("UNAUTHORIZED: Invalid token format");
        }

        return authHeader.substring(7);
    }

    /**
     * userGuard: Ensures the request is made by a valid User.
     */
    public static User userGuard(WebServiceContext context) throws Exception {
        String token = extractToken(context);
        String userId = JwtUtil.validateTokenAndGetUserId(token);

        if (userId == null) {
            throw new Exception("UNAUTHORIZED: Invalid or expired token");
        }

        return userRepo.loadAll().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new Exception("UNAUTHORIZED: User account not found."));
    }

    /**
     * adminGuard: Ensures the request is made by ANY Admin.
     */
    public static User adminGuard(WebServiceContext context) throws Exception {
        String token = extractToken(context);
        String userId = JwtUtil.validateTokenAndGetUserId(token);

        if (userId == null) {
            throw new Exception("UNAUTHORIZED: Invalid or expired token");
        }
        User user = userRepo.loadAll().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new Exception("UNAUTHORIZED: User account not found."));
        if (user.getTier() != UserLevel.ADMIN && user.getTier() != UserLevel.DEVELOPER) {
            throw new Exception("FORBIDDEN: Admin privileges required.");
        }
        return user;
    }

    /**
     * devGuard: Ensures the request is made specifically by a DEV Admin.
     */
    public static User devGuard(WebServiceContext context) throws Exception {
        User user = userGuard(context);

        // Adjust AdminLevel.DEV based on your actual enum implementation
        if (user.getTier() != UserLevel.DEVELOPER) {
            throw new Exception("FORBIDDEN: Developer privileges required.");
        }
        return user;
    }
}
