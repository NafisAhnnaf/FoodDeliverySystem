package com.swe4302;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.github.lalyos.jfiglet.FigletFont;
import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import com.swe4302.controllers.AuthController;
import com.swe4302.controllers.DeliveryController;
import com.swe4302.controllers.OrderController;
import com.swe4302.controllers.RestaurantController;
import com.swe4302.controllers.UserController;

import jakarta.xml.ws.Endpoint;

public class App {

    public static void main(String[] args) {
        printBanner();
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

            // Register all your controllers
            publishService(server, "/restaurant-service", new RestaurantController());
            publishService(server, "/user-service", new UserController());
            publishService(server, "/order-service", new OrderController());
            publishService(server, "/auth-service", new AuthController());
            publishService(server, "/delivery-service", new DeliveryController());

            server.setExecutor(null);
            server.start();

            System.out.println("\n✅ Backend Services started successfully on port 8080");
        } catch (Exception e) {
            System.err.println("❌ FATAL ERROR: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void publishService(HttpServer server, String path, Object implementor) {
        var context = server.createContext(path);

        // Instead of setHandler, we use a Filter to avoid the "handler already set" error
        context.getFilters().add(new Filter() {
            @Override
            public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
                ClassLoader previousClassLoader = Thread.currentThread().getContextClassLoader();
                Thread.currentThread().setContextClassLoader(App.class.getClassLoader());

                // 1. Add CORS Headers to every response
                try {
                    exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                    exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization, SOAPAction");
                    exchange.getResponseHeaders().add("Access-Control-Max-Age", "86400");

                    // 2. Handle the "Preflight" OPTIONS request
                    if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                        exchange.sendResponseHeaders(204, -1);
                        return;
                    }

                    // 3. Let the JAX-WS SOAP handler take over for POST requests
                    chain.doFilter(exchange);
                } finally {
                    Thread.currentThread().setContextClassLoader(previousClassLoader);
                }
            }

            @Override
            public String description() {
                return "CORS Filter";
            }
        });

        // Now JAX-WS can safely set its own handler without conflict
        Endpoint endpoint = Endpoint.create(implementor);
        endpoint.publish(context);

        System.out.println("🚀 Service Live: http://localhost:8080" + path + "?wsdl");
    }

    private static void printBanner() {
        try {
            System.out.println("=================================================================================");
            System.out.println(FigletFont.convertOneLine("FOOD-DELIVERY") + " v1.0");
            System.out.println("================================================================================= \n");
        } catch (Exception e) {
            System.out.println("Food Delivery System - Backend");
        }
    }
}
