import React, { useContext, useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Shield, LogOut,
    Settings, Trash2, Edit3, Save, X, ChevronRight,
    ShoppingCart, Clock, Loader2 // Added these for the orders section
} from 'lucide-react';
import { AuthContext } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { callSoapAction } from '../utils/soapClient';

const Profile = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [formData, setFormData] = useState({
        fullName: auth?.user?.fullName || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || ''
    });

    // Fetch Orders from backend on mount
    useEffect(() => {
        const fetchOrders = async () => {
            if (!auth?.user?.email) return;
            try {
                setLoadingOrders(true);
                const data = await callSoapAction<any[]>('/api/order-service', 'getUserOrderHistory');
                console.log("Fetched orders:", data);
                setOrders(Array.isArray(data) ? data : data ? [data] : []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    if (!auth?.user) {
        return <div className="p-20 text-center font-sans text-gray-500">Loading user profile...</div>;
    }

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await callSoapAction<string>('/api/user-service', 'updateProfile', {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            });

            if (response?.includes("SUCCESS")) {
                auth.setUser({ ...auth.user!, ...formData });
                setIsEditing(false);
                toast.success("Profile updated!");
            }
        } catch (err: any) {
            toast.error("Failed to update: " + err.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("CRITICAL: Are you sure? This will permanently delete your XML record.")) {
            try {
                await callSoapAction('/api/user-service', 'deleteUser', { email: auth.user?.email });
                auth.logout();
                navigate('/signup');
            } catch (err) {
                toast.error("Could not delete account.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
            <Toaster />
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-orange-400 to-rose-400" />
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12">
                            <div className="p-1 bg-white rounded-2xl shadow-lg">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-orange-500">
                                    <User size={48} />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all text-sm"
                                >
                                    {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold transition-all text-sm"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h1 className="text-3xl font-black text-gray-900">{auth.user.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1 text-gray-500 font-medium">
                                <Shield size={16} className="text-orange-500" />
                                <span className="uppercase text-xs tracking-widest bg-orange-50 px-2 py-0.5 rounded text-orange-600">
                                    {auth.user.tier} Account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Details Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Settings size={20} className="text-gray-400" /> Account Information
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailItem
                                        icon={<Mail />} label="Email Address"
                                        value={auth.user.email} disabled
                                    />
                                    <DetailItem
                                        icon={<User />} label="Full Name"
                                        value={isEditing ? formData.fullName : auth.user.fullName}
                                        isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, fullName: v })}
                                    />
                                    <DetailItem
                                        icon={<Phone />} label="Phone Number"
                                        value={isEditing ? formData.phone : auth.user.phone || 'Not set'}
                                        isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, phone: v })}
                                    />
                                    <DetailItem
                                        icon={<MapPin />} label="Location / Address"
                                        value={isEditing ? formData.address : auth.user.address || 'Not set'}
                                        isEditing={isEditing}
                                        onChange={(v: string) => setFormData({ ...formData, address: v })}
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        type="submit"
                                        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                                    >
                                        <Save size={18} /> Save Changes
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* NEW SECTION: Past Orders Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingCart size={20} className="text-orange-500" /> Past Orders
                                </h3>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                    {orders.length} Orders
                                </span>
                            </div>

                            <div className="p-6">
                                {loadingOrders ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-orange-500" size={32} />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-sm">No orders found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500">
                                                        <Clock size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm">{order.restaurantName || "Restaurant Order"}</h4>
                                                        <p className="text-[10px] text-gray-400 font-mono">ID: #{order.id?.substring(0, 8) || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900 text-sm">৳{order.total || "0.00"}</p>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-orange-100 text-orange-600">
                                                        {order.status || "Completed"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Control Panel Card */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Danger Zone</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 size={20} />
                                        <span className="font-bold text-sm">Delete Account</span>
                                    </div>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[10px] text-gray-400 px-2 italic">
                                    * Account deletion is irreversible and clears all XML associations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value, isEditing, onChange, disabled }: any) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter ml-1">{label}</p>
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing && !disabled ? 'bg-white border-orange-200 ring-2 ring-orange-50' : 'bg-gray-50 border-transparent'}`}>
            <span className="text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
            {isEditing && !disabled ? (
                <input
                    className="bg-transparent border-none outline-none w-full text-sm font-bold text-gray-800"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <span className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>{value}</span>
            )}
        </div>
    </div>
);

export default Profile;