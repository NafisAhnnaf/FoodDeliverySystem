package com.swe4302.services;

import com.swe4302.models.Order;
import com.swe4302.models.Restaurant;
import com.swe4302.models.User;
import com.swe4302.repositories.XmlRepository;
import com.swe4302.utils.OrderLine;
import java.util.List;
import java.util.stream.Collectors;

public class OrderService {

    private final XmlRepository<Order> orderRepo = new XmlRepository<>(Order.class, "orders.xml");
    private final XmlRepository<Restaurant> restRepo = new XmlRepository<>(Restaurant.class, "restaurants.xml");
    private final DeliveryService deliveryService = new DeliveryService();

    public List<Order> fetchAllOrders() throws Exception {
        return orderRepo.loadAll();
    }
    public void storeAllOrders(List<Order> orders) throws Exception {
        orderRepo.saveAll(orders);
    }

    public String createOrder(User user, String restaurantId, List<OrderLine> items, String deliveryAddress) throws Exception {
        List<Order>orders = fetchAllOrders();
        if(orders.stream().filter(o-> o.getCustomerId().equals(user.getId()) && o.getStatus() != Order.OrderStatus.DELIVERED).count() >= 1) {
            throw new Exception("You have too many active orders. Please wait for them to be delivered before placing new ones.");
        }
                
        Restaurant restaurant = restRepo.loadAll().stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new Exception("Restaurant not found"));
    
        Order newOrder = new Order(user.getId(), restaurantId, restaurant.getName(), deliveryAddress);

        // 3. Add items (Order model handles the logic/snapshots)
        for (OrderLine line : items) {
            newOrder.addItem(line.getItem(), line.getQuantity());
        }
        newOrder.calculateFinalAmounts();
        // 4. Save to XML
        
        orders.add(newOrder);
        orderRepo.saveAll(orders);

        return newOrder.getId();
    }



    public Order updateOrderStatus(String orderId, Order.OrderStatus newStatus) throws Exception {
        List<Order> orders = orderRepo.loadAll();

        for (Order o : orders) {
            if (o.getId().equals(orderId)) {
                o.setStatus(newStatus);
                if(newStatus == Order.OrderStatus.DELIVERED){
                    new DeliveryService().completeDelivery(o.getDeliveryId());                }
                orderRepo.saveAll(orders);
                return o;
            }
        }
        throw new Exception("Order not found");
    }

    public Order getOrderById(String orderId) throws Exception {
        return orderRepo.loadAll().stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new Exception("Order not found"));
    }

    public List<Order> getAllOrders() throws Exception {
        return fetchAllOrders();
    }
  

    public List<Order> getOrdersByUser(String userId) throws Exception {    
        return orderRepo.loadAll().stream()
                .filter(o -> o.getCustomerId().equals(userId))
                .collect(Collectors.toList());
    }
    public List<Order> getOrdersByRestaurant(String restaurantId) throws Exception {
        return orderRepo.loadAll().stream()
                .filter(o -> o.getRestaurantId().equals(restaurantId))
                .collect(Collectors.toList());
    }
}