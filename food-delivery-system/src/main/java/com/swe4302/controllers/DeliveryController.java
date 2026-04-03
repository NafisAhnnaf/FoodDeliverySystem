package com.swe4302.controllers;

import com.swe4302.middlewares.AuthGuard;
import com.swe4302.models.Delivery;
// import com.swe4302.models.Delivery.DeliveryStatus;
import com.swe4302.models.Rider;
import com.swe4302.models.User;
import com.swe4302.services.DeliveryService;
import jakarta.annotation.Resource;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.xml.ws.WebServiceContext;
import java.util.List;

@WebService(serviceName = "DeliveryService")
public class DeliveryController {

    @Resource
    private WebServiceContext context;

    private final DeliveryService deliveryService = new DeliveryService();

    @WebMethod(operationName = "appointRider")
    public String appointRider(
            @WebParam(name = "userEmail") String userEmail, 
            @WebParam(name = "licenseNumber") String licenseNumber) throws Exception {
        AuthGuard.adminGuard(context);
        return deliveryService.appointRider(userEmail, licenseNumber);
    }

    @WebMethod(operationName = "assignRider")
    public String assignRider(
            @WebParam(name = "deliveryId") String deliveryId,
            @WebParam(name = "riderId") String riderId) throws Exception {
        AuthGuard.adminGuard(context);
        System.out.println("Assigning rider with ID: " + riderId + " to delivery ID: " + deliveryId);
        deliveryService.assignRider(deliveryId, riderId);
        return "SUCCESS";
    }

    @WebMethod(operationName = "getAllRiders")
    public List<Rider> getAllRiders() throws Exception {
        AuthGuard.adminGuard(context);
        return deliveryService.getAllRiders();
    }

    @WebMethod(operationName = "initializeDelivery")
    public String initializeDelivery(
            @WebParam(name = "orderId") String orderId
    ) throws Exception {
        User u = AuthGuard.adminGuard(context);
        return deliveryService.initializeDelivery( orderId);
    }

    // @WebMethod(operationName = "updateDeliveryStatus")
    // public String updateDeliveryStatus(
    //         @WebParam(name = "deliveryId") String deliveryId,
    //         @WebParam(name = "status") String status) throws Exception {
    //     AuthGuard.adminGuard(context);
    //     DeliveryStatus newStatus = DeliveryStatus.valueOf(status.toUpperCase());
    //     deliveryService.updateStatus(deliveryId, newStatus);
    //     return "SUCCESS";
    // }

    @WebMethod(operationName = "getDeliveryInfo")
    public Delivery getDeliveryInfo(@WebParam(name = "orderId") String orderId) throws Exception {
        // userGuard allowed here so customers can track their own order status
        AuthGuard.userGuard(context);
        Delivery delivery = deliveryService.getDeliveryByOrderId(orderId);
        return delivery;
    }
}