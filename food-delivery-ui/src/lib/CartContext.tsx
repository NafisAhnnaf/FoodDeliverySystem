import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as engineAdd, clearCart as engineClear } from '../utils/cartEngine';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState(getCart());

    const refreshCart = () => setCart(getCart());

    const add = (item: any, resId: string) => {
        engineAdd(item, resId);
        refreshCart();
    };

    const clear = () => {
        engineClear();
        refreshCart();
    };

    return (
        <CartContext.Provider value={{ cart, add, clear }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);