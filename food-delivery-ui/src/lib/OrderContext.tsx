import React, { createContext, useContext, useState, useEffect } from 'react';

interface Order {
    id: string;
    status: 'PENDING' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED';
    restaurantName: string;
    total: number;
}

interface OrderContextType {
    activeOrder: Order | null;
    setActiveOrder: (order: Order | null) => void;
    refreshOrderStatus: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);

    // Persist active order ID in localStorage so it survives reloads
    const fetchActiveOrder = async (id: string) => {
        // Implementation for polling/fetching order status
        // If status === 'DELIVERED', you might want to clear it after a delay
    };
    useEffect(() => {
        const savedOrderId = localStorage.getItem('active_order_id');
        if (savedOrderId && !activeOrder) {
            // In a real app, you'd fetch the latest status from backend here
            // For now, we'll mock the hydration
            fetchActiveOrder(savedOrderId);
        }
    }, []);



    return (
        <OrderContext.Provider value={{ activeOrder, setActiveOrder, refreshOrderStatus: async () => { } }}>
            {children}
            {/* The Global Floating Bookmark */}
            {activeOrder && activeOrder.status !== 'DELIVERED' && (
                <div
                    onClick={() => window.location.href = `/track/${activeOrder.id}`}
                    className="fixed bottom-24 right-6 z-50 bg-orange-500 text-white p-4 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-all flex items-center gap-3 animate-bounce-subtle"
                >
                    <div className="bg-white/20 p-2 rounded-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">Active Order</p>
                        <p className="text-xs font-bold leading-none">{activeOrder.restaurantName}</p>
                    </div>
                </div>
            )}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error("useOrder must be used within OrderProvider");
    return context;
};