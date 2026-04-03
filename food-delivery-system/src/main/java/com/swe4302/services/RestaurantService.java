package com.swe4302.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.swe4302.dto.RestaurantOwnerDTO;
import com.swe4302.dto.SearchMatchDTO;
import com.swe4302.models.Menu;
import com.swe4302.models.MenuItem;
import com.swe4302.models.OpenHours;
import com.swe4302.models.Restaurant;
import com.swe4302.models.Review;
import com.swe4302.repositories.XmlRepository;

public class RestaurantService {

    private final XmlRepository<Restaurant> restRepo = new XmlRepository<>(Restaurant.class, "restaurants.xml");
    private final XmlRepository<Review> reviewRepo = new XmlRepository<>(Review.class, "reviews.xml");
    private final XmlRepository<Menu> menuRepo = new XmlRepository<>(Menu.class, "menus.xml");
    private final MenuService menuService = new MenuService();

    public List<Restaurant> fetchAllRestaurants() throws Exception {
        return restRepo.loadAll();
    }

    public RestaurantOwnerDTO getRestaurantByOwner(String ownerUserId) throws Exception {
        List<Restaurant> restaurants = restRepo.loadAll();
        List<Menu> menus = menuRepo.loadAll();
        System.out.println("Printing loaded menus: " + menus);
        // Returns the first restaurant owned by this admin, or null if none exist
        Restaurant found = restaurants.stream()
                .filter(r -> ownerUserId.equals(r.getOwnerUserId()))
                .findFirst()
                .orElse(null);
        if (found == null) {
            return null; // No restaurant found for this owner
        }
        List<Menu> foundMenus = menus.stream()
                .filter(m -> found.getId().equals(m.getRestaurantId()))
                .collect(Collectors.toList());
        RestaurantOwnerDTO res = new RestaurantOwnerDTO(found, foundMenus);
        // System.out.println(foundMenus);
        return res;
    }

    public RestaurantOwnerDTO getRestaurantById(String resId) throws Exception {
        List<Restaurant> restaurants = restRepo.loadAll();
        List<Menu> menus = menuRepo.loadAll();
        System.out.println("Printing loaded menus: " + menus);
        // Returns the first restaurant owned by this admin, or null if none exist
        Restaurant found = restaurants.stream()
                .filter(r -> resId.equals(r.getId()))
                .findFirst()
                .orElse(null);
        if (found == null) {
            return null; // No restaurant found for this owner
        }
        List<Menu> foundMenus = menus.stream()
                .filter(m -> found.getId().equals(m.getRestaurantId()))
                .collect(Collectors.toList());
        RestaurantOwnerDTO res = new RestaurantOwnerDTO(found, foundMenus);

        return res;
    }

    public List<SearchMatchDTO> search(String keyword) throws Exception {
        String query = keyword.toLowerCase().trim();
        List<SearchMatchDTO> matches = new ArrayList<>();

        // 1. Search in Restaurants File
        List<Restaurant> allRestaurants = fetchAllRestaurants();
        for (Restaurant res : allRestaurants) {
            if (res.getName().toLowerCase().contains(query)) {
                matches.add(new SearchMatchDTO(res.getId(), res.getName()));
            }
        }

        // 2. Search in Menus File
        List<Menu> allMenus = menuService.fetchAllMenu(); // Assuming this exists
        for (Menu menu : allMenus) {
            if (menu.getMenuItems() != null) {
                if (menu.getName().toLowerCase().contains(query)) {
                    matches.add(new SearchMatchDTO(menu.getRestaurantId(), menu.getName()));
                }
                for (MenuItem item : menu.getMenuItems()) {
                    if (item.getName().toLowerCase().contains(query)) {
                        // We return the RestaurantID and the Item Name as the "Match Text"
                        matches.add(new SearchMatchDTO(menu.getRestaurantId(), item.getName()));
                    }
                }
            }
        }

        return matches;
    }

    public String createRestaurant(String name, String address, String phone, String ownerUserId) throws Exception {
        List<Restaurant> restaurants = restRepo.loadAll();
        Restaurant newRest = new Restaurant(name, address, phone, ownerUserId);
        restaurants.add(newRest);
        restRepo.saveAll(restaurants);
        return newRest.getId();
    }

    public String createReview(String restaurantId, String userId, String text, int rating) throws Exception {
        List<Review> reviews = reviewRepo.loadAll();

        // Enforce: One review per user per restaurant
        boolean alreadyReviewed = reviews.stream()
                .anyMatch(r -> r.getRestaurantId().equals(restaurantId) && r.getUserId().equals(userId));

        if (alreadyReviewed) {
            throw new Exception("FORBIDDEN: You have already submitted a review for this restaurant.");
        }

        Review newReview = new Review(restaurantId, userId, text, rating);
        reviews.add(newReview);
        reviewRepo.saveAll(reviews);
        return newReview.getId();
    }

    public void updateRestaurantSchedule(String restaurantId, List<OpenHours> newSchedule) throws Exception {
        List<Restaurant> restaurants = restRepo.loadAll();

        Restaurant rest = restaurants.stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new Exception("Restaurant not found"));

        rest.setSchedule(newSchedule);
        restRepo.saveAll(restaurants);
    }

}
