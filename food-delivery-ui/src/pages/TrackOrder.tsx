import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Utensils, Bike, CheckCircle2, MapPin, Loader2, Phone } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import toast, { Toaster } from 'react-hot-toast';

// Mapping Frontend Steps to Java OrderStatus Enums
const steps = [
    { id: 'CREATED', label: 'Order Placed', icon: Package, desc: 'We have received your order' },
    { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, desc: 'Restaurant has accepted' },
    { id: 'PREPARING', label: 'Preparing', icon: Utensils, desc: 'Chef is working their magic' },
    { id: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Bike, desc: 'Rider is heading to you' },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your meal!' },
];

export default function TrackOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [delivery, setDelivery] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // 1. Fetch Order Details
            const orderData = await callSoapAction('/api/order-service', 'getOrderById', { orderId: id });
            console.log("Fetched order data:", orderData);
            setOrder(orderData[0]);

            // 2. Fetch Delivery/Rider Details (Only if order is beyond PREPARING)
            if (orderData[0].deliveryId || orderData.status === 'OUT_FOR_DELIVERY') {
                const deliveryData = await callSoapAction('/api/delivery-service', 'getDeliveryInfo', { orderId: id });
                console.log("Fetched delivery data:", deliveryData);
                setDelivery(deliveryData);
            }
        } catch (err: any) {
            console.error("Tracking Error:", err);
            toast.error("Could not sync order status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Polling: Refresh status every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Locating your meal...</p>
        </div>
    );

    if (!order) return <div className="p-20 text-center font-bold">Order not found.</div>;

    const currentStepIndex = steps.findIndex(s => s.id === order.status);

    return (
        <div className="min-h-screen bg-slate-50 pb-12 animate-in fade-in duration-700">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto px-6 pt-8">
                <button
                    onClick={() => navigate('/orders')}
                    className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-orange-500 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to History
                </button>

                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Live Tracking</p>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">#{order.id?.slice(-6)}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-slate-900 tracking-tight">{order.restaurantName}</p>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Paid ${order.total}</p>
                        </div>
                    </div>

                    {/* Stepper logic */}
                    <div className="space-y-10 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-slate-50" />
                        <div
                            className="absolute left-[19px] top-4 w-1 bg-orange-500 transition-all duration-1000 ease-in-out"
                            style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex gap-6 relative z-10">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 ${isCompleted || isCurrent
                                        ? 'bg-orange-500 text-white shadow-xl shadow-orange-200 scale-110'
                                        : 'bg-white border-2 border-slate-100 text-slate-200'
                                        }`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className={`font-black text-sm tracking-tight transition-colors ${isCurrent ? 'text-slate-900 text-base' : 'text-slate-400'}`}>
                                            {step.label}
                                        </h3>
                                        <p className={`text-xs leading-relaxed ${isCurrent ? 'text-slate-500 font-medium' : 'text-slate-300'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                    {isCurrent && (
                                        <div className="bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100 h-fit self-center">
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rider Card - Appears only when assigned */}
                {delivery && delivery.rider && (
                    <div className="bg-white rounded-[2rem] p-6 mb-6 border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-right-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <Bike size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Rider</p>
                                <p className="text-base font-black text-slate-900">{delivery.rider.fullName}</p>
                                <p className="text-xs font-bold text-slate-500">{delivery.vehicle?.vehicleType || 'Motorbike'}</p>
                            </div>
                        </div>
                        <a href={`tel:${delivery.rider.phone}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200">
                            <Phone size={20} />
                        </a>
                    </div>
                )}

                {/* Delivery Address Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-6 relative overflow-hidden group">
                    <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                        <MapPin className="text-orange-400" size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Destination</p>
                        <p className="text-base font-bold tracking-tight text-slate-100">{order.deliveryAddress || "Fetching address..."}</p>
                    </div>
                    <MapPin className="absolute -right-4 -bottom-4 text-white/5" size={120} />
                </div>
            </div>
        </div>
    );
}