import React, { useState } from 'react';
import { Trash2, CreditCard, ShoppingCart, Loader2, MapPin, Wallet } from 'lucide-react';
import { getCart, clearCart } from '../utils/cartEngine';
import { callSoapAction } from '../utils/soapClient';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Cart() {
    const [cart, setCart] = useState(getCart());
    const [isPlacing, setIsPlacing] = useState(false);

    // New Fields
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');

    const navigate = useNavigate();

    const handleRemove = (itemId: string) => {
        const updatedItems = cart.items.filter((i: any) => i.id !== itemId);
        const newTotal = updatedItems.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

        const newCart = { ...cart, items: updatedItems, total: newTotal };
        if (updatedItems.length === 0) newCart.restaurantId = null;

        setCart(newCart);
        localStorage.setItem('food_cart', JSON.stringify(newCart));
    };

    const handlePlaceOrder = async () => {
        if (!cart.restaurantId || cart.items.length === 0) return;
        // if (!address.trim()) {
        //     toast.error("Please provide a delivery address");
        //     return;
        // }

        setIsPlacing(true);
        try {
            const soapItems = cart.items.map((item: any) => ({
                item: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    available: true
                },
                quantity: item.quantity
            }));

            // 1. Create the Order
            const orderId = await callSoapAction('/api/order-service', 'createOrder', {
                restaurantId: cart.restaurantId,
                items: soapItems,
                deliveryAddress: address,
                // paymentMethod: paymentMethod
            });

            if (orderId) {
                toast.success("Order & Delivery Initialized!");
                clearCart();
                setTimeout(() => navigate(`/track/${orderId}`), 1000);
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            toast.error(error.message || "Failed to process your order");
        } finally {
            setIsPlacing(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="p-20 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingCart size={40} className="text-slate-200" />
                </div>
                <p className="text-slate-800 font-black text-xl tracking-tight">Your cart is empty</p>
                <button onClick={() => navigate('/restaurants')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm">Browse Restaurants</button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20">
            <Toaster position="top-right" />

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">Your Cart</h2>
                <span className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {cart.items.length} Items
                </span>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-10">
                {cart.items.map((item: any) => (
                    <div key={item.id} className="group flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:text-orange-500 transition-colors">
                                {item.quantity}x
                            </div>
                            <div>
                                <p className="font-black text-slate-800 tracking-tight">{item.name}</p>
                                <p className="text-xs text-emerald-600 font-black tracking-widest">${item.price}</p>
                            </div>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="text-slate-300 p-3 hover:text-rose-500 transition-all">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Logistics & Payment Section */}
            <div className="bg-slate-100/50 p-8 rounded-[2.5rem] mb-10 border border-slate-200/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Delivery Details</h3>

                <div className="space-y-6">
                    {/* Address Input */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Enter delivery address..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 shadow-sm"
                        />
                    </div>

                    {/* Payment Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod('CASH')}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'CASH' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-white bg-white text-slate-400'}`}
                        >
                            <Wallet size={18} />
                            <span className="text-xs font-black uppercase">Cash</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('CARD')}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-white bg-white text-slate-400'}`}
                        >
                            <CreditCard size={18} />
                            <span className="text-xs font-black uppercase">Card</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Total & Place Order */}
            <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                <ShoppingCart className="absolute -right-8 -bottom-8 text-white/5" size={160} />
                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Payable</p>
                            <span className="text-5xl font-black tracking-tighter text-white">
                                ${cart.total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        disabled={isPlacing}
                        onClick={handlePlaceOrder}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        {isPlacing ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
                        {isPlacing ? "Processing..." : "Place Order Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}