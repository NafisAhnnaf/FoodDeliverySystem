package com.swe4302.services;

import com.swe4302.models.Delivery;
// import com.swe4302.models.Delivery.DeliveryStatus;
import com.swe4302.models.Order;
import com.swe4302.models.Rider;
import com.swe4302.models.User;
import com.swe4302.repositories.XmlRepository;
import java.util.List;

public class DeliveryService {
    private final XmlRepository<Delivery> deliveryRepo = new XmlRepository<>(Delivery.class, "deliveries.xml");
    private final XmlRepository<Rider> riderRepo = new XmlRepository<>(Rider.class, "riders.xml");
    private final XmlRepository<User> userRepo = new XmlRepository<>(User.class, "users.xml");
    private final XmlRepository<Order> orderRepo = new XmlRepository<>(Order.class, "orders.xml");


    // 1. Appoint a User as a Rider (Admin Only)
    public String appointRider(String userEmail, String licenseNumber) throws Exception {
        System.out.println("Appointing rider with email: " + userEmail + " and license: " + licenseNumber);   
        User user = userRepo.loadAll().stream()
                .filter(u -> u.getEmail().equals(userEmail))
                .findFirst()
                .orElseThrow(() -> new Exception("User account not found"));

        // Check for duplicates
        boolean alreadyRider = riderRepo.loadAll().stream()
                .anyMatch(r -> r.getUserId().equals(user.getId()));
        if (alreadyRider) throw new Exception("This user is already a rider");

        Rider newRider = new Rider(user.getId(), user.getFullName(), user.getPhone(), licenseNumber);
        
        List<Rider> riders = riderRepo.loadAll();
        riders.add(newRider);
        riderRepo.saveAll(riders);
        
        return newRider.getId();
    }

    // 2. Assign an available Rider to a Delivery (Admin Only)
    public void assignRider(String deliveryId, String riderId) throws Exception {
        List<Rider> riders = riderRepo.loadAll();
        Rider selectedRider = riders.stream()
                .filter(r -> r.getId().equals(riderId) && r.isAvailable())
                .findFirst()
                .orElseThrow(() -> new Exception("Rider not found or currently busy"));

        List<Delivery> deliveries = deliveryRepo.loadAll();
        Delivery delivery = deliveries.stream()
                .filter(d -> d.getId().equals(deliveryId))
                .findFirst()
                .orElseThrow(() -> new Exception("Delivery record not found"));

        // Update Rider availability
        selectedRider.setAvailable(false);
        
        // Map rider to delivery
        delivery.assignRider(selectedRider); 
        // delivery.setStatus(DeliveryStatus.ASSIGNED);

        riderRepo.saveAll(riders);
        deliveryRepo.saveAll(deliveries);
    }

    public void freeUpRider(String riderId) throws Exception {
        List<Rider> riders = riderRepo.loadAll();
        for (Rider r : riders) {
            if (r.getId().equals(riderId)) {
                r.setAvailable(true);
                break;
            }
        }
        riderRepo.saveAll(riders);
    }

    // 3. Get All Riders for Admin List (Admin Only)
    public List<Rider> getAllRiders() throws Exception {
        return riderRepo.loadAll();
    }

    public String initializeDelivery(String orderId) throws Exception {
        List<Order> orders  = orderRepo.loadAll();
        Order order = orders.stream().filter(o -> o.getId().equals(orderId)).findFirst()
                .orElseThrow(() -> new Exception("Order not found"));
        Delivery delivery = new Delivery(orderId, order.getDeliveryAddress());
        
        order.setDeliveryId(delivery.getId());
        order.setStatus(Order.OrderStatus.OUT_FOR_DELIVERY); 

        List<Delivery> deliveries = deliveryRepo.loadAll();
        deliveries.add(delivery);
        deliveryRepo.saveAll(deliveries);
        orderRepo.saveAll(orders);
        return delivery.getId();
    }

    public void completeDelivery(String deliveryId) throws Exception {
        if (deliveryId == null) throw new Exception("Order has no associated delivery ID"); // Guard clause
        
        List<Delivery> deliveries = deliveryRepo.loadAll();
        Delivery target = deliveries.stream()
                .filter(d -> d.getId().equals(deliveryId))
                .findFirst()
                .orElseThrow(() -> new Exception("Delivery not found in XML"));
                
        if (target.getRider() != null) {
            freeUpRider(target.getRider().getId());
        }
    }

    // public void updateStatus(String deliveryId, DeliveryStatus newStatus) throws Exception {
    //     List<Delivery> deliveries = deliveryRepo.loadAll();
    //     Delivery target = null;
    //     for (Delivery d : deliveries) {
    //         if (d.getId().equals(deliveryId)) {
    //             d.setStatus(newStatus);
    //             target = d;
    //             break;
    //         }
    //     }
        
    //     if (target == null) throw new Exception("Delivery not found");

    //     // Logic: If order is delivered, free up the rider
    //     if (newStatus == DeliveryStatus.DELIVERED && target.getRider() != null) {
    //         List<Rider> riders = riderRepo.loadAll();
    //         for (Rider r : riders) {
    //             if (r.getId().equals(target.getRider().getId())) {
    //                 r.setAvailable(true);
    //                 break;
    //             }
    //         }
    //         riderRepo.saveAll(riders);
    //     }

    //     deliveryRepo.saveAll(deliveries);

    //     // Sync with Order Service status
    //     if (newStatus == DeliveryStatus.PICKED_UP) {
    //         orderService.updateOrderStatus(target.getOrderId(), Order.OrderStatus.OUT_FOR_DELIVERY);
    //     } else if (newStatus == DeliveryStatus.DELIVERED) {
    //         orderService.updateOrderStatus(target.getOrderId(), Order.OrderStatus.DELIVERED);
    //     }
    // }

    public Delivery getDeliveryByOrderId(String orderId) throws Exception {
        System.out.println("Fetching delivery info for orderId: " + orderId);
        return deliveryRepo.loadAll().stream()
                .filter(d -> d.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);
    }
}