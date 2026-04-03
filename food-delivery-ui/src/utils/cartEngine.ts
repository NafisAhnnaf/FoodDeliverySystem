// src/utils/cartEngine.ts

export const getCart = () => {
    const saved = localStorage.getItem('food_cart');
    if (!saved) return { restaurantId: null, items: [], total: 0 };
    return JSON.parse(saved);
};

/**
 * Completely wipes the cart from storage
 */
export const clearCart = () => {
    localStorage.removeItem('food_cart');
    // Return a fresh empty state
    return { restaurantId: null, items: [], total: 0 };
};

export const addToCart = (item: any, restaurantId: string) => {
    let cart = getCart();

    // Logic: If adding from a new restaurant, we MUST clear the old one first
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
        // In a real UI, you'd show a modal, but for logic:
        cart = { restaurantId, items: [], total: 0 };
    }

    cart.restaurantId = restaurantId;

    // Find if item exists (matching by ID)
    const existingIndex = cart.items.findIndex((i: any) => i.id === item.id);

    if (existingIndex > -1) {
        cart.items[existingIndex].quantity += 1;
    } else {
        // Add new item with initial quantity of 1
        cart.items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    // Recalculate Total
    cart.total = cart.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

    localStorage.setItem('food_cart', JSON.stringify(cart));
    return cart;
};