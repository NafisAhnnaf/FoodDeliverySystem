package com.swe4302.controllers;

import com.swe4302.middlewares.AuthGuard;
import com.swe4302.models.Order;
import com.swe4302.models.User;
import com.swe4302.utils.OrderLine;
import com.swe4302.services.OrderService;

import jakarta.annotation.Resource;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.xml.ws.WebServiceContext;
import java.util.List;

@WebService(serviceName = "OrderService")
public class OrderController {

    @Resource
    private WebServiceContext context;

    private final OrderService orderService = new OrderService();

    @WebMethod(operationName = "createOrder")
    public String createOrder(
            @WebParam(name = "restaurantId") String restaurantId,
            @WebParam(name = "items") List<OrderLine> items, 
            @WebParam(name = "deliveryAddress") String deliveryAddress 
        ) throws Exception {

        // Use userGuard to ensure only logged-in users can order
        User user = AuthGuard.userGuard(context);
        
        if(deliveryAddress == null || deliveryAddress.trim().isEmpty()) {
            deliveryAddress = user.getAddress();
        }
        return orderService.createOrder(user, restaurantId, items, deliveryAddress);
    }

    @WebMethod(operationName = "getOrderById")
    public Order getOrderById(@WebParam(name = "orderId") String orderId) throws Exception {
        // Guarded to ensure session is valid
        AuthGuard.userGuard(context);
        return orderService.getOrderById(orderId);
    }
    @WebMethod(operationName = "getAllOrders")
    public List<Order> getAllOrders() throws Exception {
        // Guarded to ensure session is valid
        AuthGuard.userGuard(context);
        return orderService.getAllOrders();
    }

    @WebMethod(operationName = "getUserOrderHistory")
    public List<Order> getUserOrderHistory() throws Exception {
        // Extract user from token to get THEIR specific history
        User user = AuthGuard.userGuard(context);
        System.out.println("Fetching order history for user: " + user.getId());
        return orderService.getOrdersByUser(user.getId());
    }
    
    @WebMethod(operationName = "updateOrderStatus")
    public String updateOrderStatus(
            @WebParam(name = "orderId") String orderId,
            @WebParam(name = "newStatus") String newStatus) throws Exception {
        
        AuthGuard.adminGuard(context); // Secures the route

        Order.OrderStatus statusEnum = Order.OrderStatus.valueOf(newStatus.toUpperCase());
        // 3. Update via service
        orderService.updateOrderStatus(orderId, statusEnum);
        return "SUCCESS";
    }
}