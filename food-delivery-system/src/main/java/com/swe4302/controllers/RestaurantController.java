package com.swe4302.controllers;

import java.util.List;
import java.util.stream.Collectors;

import com.swe4302.dto.RestaurantListingDTO;
import com.swe4302.dto.RestaurantOwnerDTO;
import com.swe4302.dto.SearchMatchDTO;
import com.swe4302.middlewares.AuthGuard;
import com.swe4302.models.Menu;
import com.swe4302.models.MenuItem;
import com.swe4302.models.User;
import com.swe4302.services.MenuService;
import com.swe4302.services.RestaurantService;

import jakarta.annotation.Resource;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.xml.ws.WebServiceContext;

@WebService(serviceName = "RestaurantService")
public class RestaurantController {

    @Resource
    private WebServiceContext context;

    private final RestaurantService restService = new RestaurantService();
    private final MenuService menuService = new MenuService();

    @WebMethod(operationName = "getAllRestaurants")
    public List<RestaurantListingDTO> fetchAllRestaurants() throws Exception {
        return restService.fetchAllRestaurants().stream()
                .map(RestaurantListingDTO::new)
                .collect(Collectors.toList());
    }

    @WebMethod(operationName = "getMyRestaurant")
    public RestaurantOwnerDTO getMyRestaurant() throws Exception {
        User admin = AuthGuard.adminGuard(context);
        RestaurantOwnerDTO res = restService.getRestaurantByOwner(admin.getId());
        return (res != null) ? res : null;
    }

    @WebMethod(operationName = "getRestaurantDetails")
    public RestaurantOwnerDTO getRestaurantDetails(@WebParam(name = "restaurantId") String resId) throws Exception {
        User user = AuthGuard.userGuard(context);
        RestaurantOwnerDTO res = restService.getRestaurantById(resId);
        return (res != null) ? res : null;
    }

    @WebMethod(operationName = "searchRestaurants")
    public List<SearchMatchDTO> searchRestaurants(@WebParam(name = "keyword") String keyword) throws Exception {
        return restService.search(keyword); // Public route
    }

    @WebMethod(operationName = "createRestaurant")
    public String createRestaurant(
            @WebParam(name = "name") String name,
            @WebParam(name = "address") String address,
            @WebParam(name = "phone") String phone) throws Exception {

        User u = AuthGuard.adminGuard(context); // Secures the route
        return restService.createRestaurant(name, address, phone, u.getId());
    }

    @WebMethod(operationName = "createReview")
    public String createReview(
            @WebParam(name = "restaurantId") String restaurantId,
            @WebParam(name = "reviewText") String reviewText,
            @WebParam(name = "rating") int rating) throws Exception {

        User user = AuthGuard.userGuard(context); // Secures route and gets the user
        return restService.createReview(restaurantId, user.getId(), reviewText, rating);
    }

    @WebMethod(operationName = "addMenu")
    public String addMenu(@WebParam(name = "restId") String restId, @WebParam(name = "menuName") String name, @WebParam(name = "description") String description) throws Exception {
        AuthGuard.adminGuard(context);
        Menu menu = new Menu(name, description, restId);
        menuService.addMenuToRestaurant(restId, menu);
        return "SUCCESS: Menu added successfully";
    }

    @WebMethod(operationName = "addMenuItem")
    public String addMenuItem(
            @WebParam(name = "menuId") String menuId,
            @WebParam(name = "itemName") String name,
            @WebParam(name = "price") double price) throws Exception {
        AuthGuard.adminGuard(context);
        MenuItem menuItem = new MenuItem(name, "", price);
        menuService.addMenuItemToMenu(menuId, menuItem);
        return "SUCCESS: Menu Item added successfully";
    }

    @WebMethod(operationName = "deleteMenu")
    public String deleteMenu(
            @WebParam(name = "menuId") String menuId) throws Exception {

        AuthGuard.adminGuard(context);
        menuService.deleteMenuFromRestaurant(menuId);
        return "SUCCESS: Menu category removed.";
    }

    @WebMethod(operationName = "deleteMenuItem")
    public String deleteMenuItem(
            @WebParam(name = "menuId") String menuId,
            @WebParam(name = "menuItemId") String menuItemId) throws Exception {

        AuthGuard.adminGuard(context);
        menuService.deleteMenuItemFromMenu(menuId, menuItemId);
        return "SUCCESS: Menu item removed.";
    }

    @WebMethod(operationName = "updateSchedule")
    public String updateSchedule(
            @WebParam(name = "restaurantId") String restaurantId,
            @WebParam(name = "schedule") List<com.swe4302.models.OpenHours> schedule) throws Exception {
        System.out.print(schedule);
        AuthGuard.adminGuard(context);
        restService.updateRestaurantSchedule(restaurantId, schedule);
        return "SUCCESS: Schedule updated.";
    }

    @WebMethod(operationName = "updateMenuItem")
    public String updateMenuItem(
            @WebParam(name = "menuId") String menuId,
            @WebParam(name = "menuItemId") String menuItemId,
            @WebParam(name = "itemName") String itemName,
            @WebParam(name = "price") double price,
            @WebParam(name = "itemDescription") String description,
            @WebParam(name = "stock") int stock
    ) throws Exception {
        AuthGuard.adminGuard(context);
        MenuItem updatedMenuItem = new MenuItem(itemName, description, price);
        updatedMenuItem.setStock(stock);

        menuService.updateMenuItemInMenu(menuId, menuItemId, updatedMenuItem);
        return "SUCCESS: Menu updated.";
    }
}
