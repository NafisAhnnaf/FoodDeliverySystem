import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Bike, RefreshCcw, Utensils, MapPin, Clock, Hash, User as UserIcon } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import toast, { Toaster } from 'react-hot-toast';

type TabType = 'PENDING' | 'ACTIVE' | 'COMPLETED';

export const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [riders, setRiders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('PENDING');
    const [loading, setLoading] = useState(false);

    // Grab restaurant name from the first order or a prop/context if available
    const restaurantName = orders.length > 0 ? orders[0].restaurantName : "Restaurant Dashboard";

    useEffect(() => { fetchInitialData(); }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [orderData, riderData] = await Promise.all([
                callSoapAction('/api/order-service', 'getAllOrders'),
                callSoapAction('/api/delivery-service', 'getAllRiders')
            ]);
            setOrders(Array.isArray(orderData) ? orderData : (orderData ? [orderData] : []));
            const normalizedRiders = (Array.isArray(riderData) ? riderData : (riderData ? [riderData] : []))
                .map(r => ({ ...r, isAvailable: String(r.available).toLowerCase() === 'true' }));
            setRiders(normalizedRiders);
        } catch (e) { toast.error("Failed to sync data"); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (orderId: string, status: string, successMsg: string) => {
        try {
            await callSoapAction('/api/order-service', 'updateOrderStatus', { orderId, newStatus: status });
            toast.success(successMsg);
            fetchInitialData();
        } catch (e) { toast.error("Update failed"); }
    };

    const handleAssignRider = async (orderId: string, riderId: string) => {
        try {
            const deliveryId = await callSoapAction('/api/delivery-service', 'initializeDelivery', { orderId });
            await callSoapAction('/api/delivery-service', 'assignRider', { deliveryId, riderId });
            toast.success("Rider dispatched!");
            fetchInitialData();
        } catch (e) { toast.error("Assignment failed"); }
    };

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'PENDING') return o.status === 'CREATED';
        if (activeTab === 'ACTIVE') return ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status);
        return o.status === 'DELIVERED' || o.status === 'CANCELLED';
    });

    return (
        <div className="p-6 bg-[#F8FAFC] min-h-screen font-sans">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                {/* Header: Identity moved here */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-5">
                        <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-200">
                            <Utensils className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{restaurantName}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock size={12} /> Live Kitchen Monitor
                                </span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <nav className="flex bg-slate-100 p-1.5 rounded-2xl">
                            {(['PENDING', 'ACTIVE', 'COMPLETED'] as TabType[]).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <button onClick={fetchInitialData} className="p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm">
                            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </header>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            {/* Card Header: Customer Info */}
                            <div className="p-6 border-b border-dashed border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-widest">
                                        <Hash size={10} /> {order.id.slice(-6)}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'CREATED' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <UserIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Customer ID</p>
                                        <p className="text-sm font-bold text-slate-800">{order.customerId.split('-')[0]}...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body: Items List (The "What to Cook" part) */}
                            <div className="p-6 flex-1 bg-slate-50/50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Manifest</p>
                                <div className="space-y-3">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="h-6 w-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-orange-500">
                                                    {item.quantity}x
                                                </span>
                                                <span className="text-xs font-bold text-slate-700">{item.item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footer: Actions */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</span>
                                    <span className="text-xl font-black text-slate-900">৳{order.total}</span>
                                </div>

                                {order.status === 'CREATED' && (
                                    <button onClick={() => handleUpdate(order.id, 'CONFIRMED', 'Order Accepted')} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
                                        Accept Order
                                    </button>
                                )}

                                {order.status === 'CONFIRMED' && (
                                    <button onClick={() => handleUpdate(order.id, 'PREPARING', 'Kitchen is cooking!')} className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                                        <Utensils size={16} /> Send to Kitchen
                                    </button>
                                )}

                                {order.status === 'PREPARING' && (
                                    <div className="relative">
                                        <select
                                            onChange={(e) => handleAssignRider(order.id, e.target.value)}
                                            className="appearance-none w-full pl-12 pr-4 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Assign Rider</option>
                                            {riders.filter(r => r.isAvailable).map(r => (
                                                <option key={r.id} value={r.id}>{r.fullName}</option>
                                            ))}
                                        </select>
                                        <Bike size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />
                                    </div>
                                )}

                                {order.status === 'OUT_FOR_DELIVERY' && (
                                    <button onClick={() => handleUpdate(order.id, 'DELIVERED', 'Delivered!')} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
                                        <MapPin size={16} /> Confirm Delivery
                                    </button>
                                )}

                                {order.status === 'DELIVERED' && (
                                    <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <CheckCircle size={16} /> Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};