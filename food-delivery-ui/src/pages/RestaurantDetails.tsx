import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingCart, MapPin, Phone, Clock, Plus,
    CheckCircle2, ChevronRight, Info, UtensilsCrossed
} from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import { getCart, addToCart, clearCart } from '../utils/cartEngine';
import { toast, Toaster } from 'react-hot-toast';

export const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(getCart());

    useEffect(() => { fetchRestaurantDetails(); }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            const data = await callSoapAction('/api/restaurant-service', 'getRestaurantDetails', { restaurantId: id });
            setRestaurant(data[0]);
        } catch (e) {
            toast.error("Could not load restaurant");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (item: any) => {
        if (cart.items.length > 0 && cart.restaurantId !== id) {
            if (window.confirm("Clear cart to add items from this restaurant?")) {
                clearCart();
                const updated = addToCart(item, id!);
                setCart(updated);
            }
            return;
        }
        setCart(addToCart(item, id!));
        toast.success(`Added ${item.name}`);
    };

    if (loading) return <div className="p-20 text-center text-slate-500 font-medium italic">Syncing kitchen data...</div>;
    if (!restaurant) return <div className="p-20 text-center font-bold">Restaurant not found</div>;

    return (
        <div className="min-h-screen bg-[#F9FBFC] pb-32 text-slate-800">
            <Toaster position="bottom-center" />

            {/* Header / Info Area */}
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                    <span className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/')}>Directory</span>
                    <ChevronRight size={10} strokeWidth={3} />
                    <span className="text-slate-900">{restaurant.name}</span>
                </nav>

                <div className="border-b border-slate-200/60 pb-12 mb-16">
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase">
                            {restaurant.name}
                        </h1>
                        {String(restaurant.isOpen) === 'true' ? (
                            <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">Live</span>
                        ) : (
                            <span className="bg-slate-200 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Closed</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> {restaurant.address}</span>
                        <span className="flex items-center gap-2"><Phone size={14} className="text-orange-500" /> {restaurant.phone}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left Side: Menus (70%) */}
                    <div className="lg:w-[70%] order-2 lg:order-1">
                        <div className="flex items-center gap-4 mb-12">
                            <UtensilsCrossed size={20} className="text-orange-500" />
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Explore Menu</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                        </div>

                        {restaurant.menus?.map((menu: any) => (
                            <div key={menu.id} className="mb-20">
                                <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
                                    <div className="w-8 h-[2px] bg-orange-500" />
                                    {menu.name}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {menu.menuItems?.map((item: any) => (
                                        <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col shadow-sm group">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h4>
                                                <span className="text-[9px] font-bold text-slate-300">#{item.id.slice(0, 4)}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-8 leading-relaxed font-medium">
                                                Standard portion size. Prepared fresh with local ingredients and Gazipur's signature spices.
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter">৳{item.price}</span>
                                                <button
                                                    onClick={() => handleAddItem(item)}
                                                    className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-500 active:scale-90 transition-all shadow-xl shadow-slate-200 group-hover:shadow-orange-200"
                                                >
                                                    <Plus size={24} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Sidebar (30%) */}
                    <div className="lg:w-[30%] order-1 lg:order-2">
                        <div className="sticky top-10">
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-50">
                                <div className="flex items-center gap-4 mb-10 text-slate-900 font-black text-xs uppercase tracking-[0.2em]">
                                    <div className="p-2 bg-orange-500 rounded-xl text-white">
                                        <Clock size={16} strokeWidth={3} />
                                    </div>
                                    Operating Hours
                                </div>

                                <div className="space-y-6">
                                    {restaurant.schedule?.map((slot: any, idx: number) => (
                                        <div key={idx} className="flex flex-col gap-1 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                            <span className="font-black text-[10px] text-orange-500 uppercase tracking-widest">{slot.day}</span>
                                            <span className="font-bold text-slate-800 text-sm">
                                                {slot.opensAt} — {slot.closesAt}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-slate-900 rounded-[1.5rem] text-white">
                                    <div className="flex items-start gap-4">
                                        <Info size={18} className="text-orange-500 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-orange-500 mb-1 font-italic">Policy</p>
                                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                                                Last order accepted 45 mins before closing.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Cart Bar */}
            {cart.items.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md p-6 z-50 border-t border-orange-500/20">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <div className="bg-orange-500 text-white h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/40">
                                    <ShoppingCart size={24} />
                                </div>
                                <span className="absolute -top-3 -right-3 bg-white text-slate-900 text-[10px] font-black h-7 w-7 rounded-full flex items-center justify-center border-4 border-slate-900">
                                    {cart.items.length}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1 italic">Ready for checkout</p>
                                <p className="text-3xl font-black text-white tracking-tighter">৳{cart.total.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/cart')}
                            className="bg-orange-500 text-white px-14 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                        >
                            Review Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};