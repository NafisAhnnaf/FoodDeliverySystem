package com.swe4302.services;

import java.util.List;

import com.swe4302.models.Menu;
import com.swe4302.models.MenuItem;
import com.swe4302.models.Restaurant;
import com.swe4302.repositories.XmlRepository;

public class MenuService {

    private final XmlRepository<Restaurant> restRepo = new XmlRepository<>(Restaurant.class, "restaurants.xml");
    private final XmlRepository<Menu> menuRepo = new XmlRepository<>(Menu.class, "menus.xml");

    public List<Menu> fetchAllMenu() throws Exception {
        return menuRepo.loadAll();
    }

    public void addMenuToRestaurant(String restaurantId, Menu newMenu) throws Exception {
        List<Restaurant> restaurants = restRepo.loadAll();
        List<Menu> menus = menuRepo.loadAll();
        Restaurant rest = restaurants.stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new Exception("Restaurant not found"));

        // rest.addMenu(newMenu);
        if (rest == null) {
            throw new Exception("Restaurant not found");
        }

        menus.add(newMenu);
        menuRepo.saveAll(menus);
    }

    public void addMenuItemToMenu(String menuId, MenuItem newMenuItem) throws Exception {
        List<Menu> menus = menuRepo.loadAll();
        Menu menu = menus.stream()
                .filter(r -> r.getId().equals(menuId))
                .findFirst()
                .orElseThrow(() -> new Exception("Menu not found"));

        if (menu == null) {
            throw new Exception("Menu not found");
        }
        menu.addMenuItem(newMenuItem);
        menuRepo.saveAll(menus);
    }

    public void deleteMenuFromRestaurant(String menuId) throws Exception {
        List<Menu> menus = menuRepo.loadAll();

        boolean removed = menus.removeIf(m -> m.getId().equals(menuId));

        if (!removed) {
            throw new Exception("Menu category not found.");
        }

        menuRepo.saveAll(menus);
    }

    public void deleteMenuItemFromMenu(String menuId, String menuItemId) throws Exception {
        List<Menu> menus = menuRepo.loadAll();
        // boolean removed = menus.removeIf(m -> m.getId().equals(menuId));
        Menu menu = menus.stream()
                .filter(r -> r.getId().equals(menuId))
                .findFirst()
                .orElseThrow(() -> new Exception("Menu not found"));

        if (menu == null) {
            throw new Exception("Menu not found");
        }
        boolean removed = menu.getMenuItems().removeIf(item -> item.getId().equals(menuItemId));
        if (!removed) {
            throw new Exception("Menu Item not found.");
        }

        menuRepo.saveAll(menus);
    }

    public void updateMenuItemInMenu(String menuId, String menuItemId, MenuItem updatedData) throws Exception {
        List<Menu> menus = menuRepo.loadAll();
        Menu menu = menus.stream()
                .filter(r -> r.getId().equals(menuId))
                .findFirst()
                .orElseThrow(() -> new Exception("Menu not found"));

        if (menu == null) {
            throw new Exception("Menu not found");
        }
        MenuItem item = menu.getMenuItems().stream()
                .filter(i -> i.getId().equals(menuItemId))
                .findFirst()
                .orElseThrow(() -> new Exception("Menu Item not found"));

        // Update fields of the existing item with the new data
        item.setName(updatedData.getName());
        item.setDescription(updatedData.getDescription());
        item.setPrice(updatedData.getPrice());
        item.setStock(updatedData.getStock());

        menuRepo.saveAll(menus);
    }
    // public void updateMenuInRestaurant(String restaurantId, String menuId, Menu updatedMenuData) throws Exception {
    //     List<Restaurant> restaurants = restRepo.loadAll();
    //     Restaurant rest = restaurants.stream()
    //             .filter(r -> r.getId().equals(restaurantId))
    //             .findFirst()
    //             .orElseThrow(() -> new Exception("Restaurant not found"));
    //     // We remove the old menu and add the updated one
    //     // Alternatively, you could find the menu and update its fields
    //     boolean removed = rest.removeMenuById(menuId);
    //     if (!removed) {
    //         throw new Exception("Original menu not found.");
    //     }
    //     // Ensure the updated menu keeps the same ID if you want to avoid breaking front-end refs
    //     // Or simply add the new object passed from the front-end
    //     rest.addMenu(updatedMenuData);
    //     restRepo.saveAll(restaurants);
    // }
}
