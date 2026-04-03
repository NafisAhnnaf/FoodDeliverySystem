import React, { useState, useEffect } from 'react';
import {
    Store, MapPin, Settings, Loader2, MessageSquare, Plus, X, Save,
    PackagePlus, ShoppingBag, LayoutDashboard, ClipboardList, Bike, CheckCircle
} from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import CreateRestaurantModal from '../components/CreateRestaurantModal';
import { MenuCategoryCard } from '../components/MenuCategoryCard';
import { ScheduleManager } from '../components/ScheduleManager';
import { OrderManagement } from '../components/OrderManagement'; // Assumed path
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
    // Navigation State
    const [activeTab, setActiveTab] = useState<'STORE' | 'ORDERS'>('STORE');

    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // UI State for the Menu Category Form
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [menuName, setMenuName] = useState('');
    const [menuDesc, setMenuDesc] = useState('');

    const fetchMyData = async () => {
        try {
            const data = await callSoapAction(`/api/restaurant-service`, 'getMyRestaurant');
            const resData = Array.isArray(data) ? data[0] : data;

            if (resData) {
                resData.menus = resData.menus ? (Array.isArray(resData.menus) ? resData.menus : [resData.menus]) : [];
                resData.schedule = resData.schedule ? (Array.isArray(resData.schedule) ? resData.schedule : [resData.schedule]) : [];

                resData.menus.forEach((m: any) => {
                    m.menuItems = m.menuItems ? (Array.isArray(m.menuItems) ? m.menuItems : [m.menuItems]) : [];
                });
            }
            setRestaurant(resData);
        } catch (err: any) {
            toast.error("Failed to sync with server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyData(); }, []);

    // --- Category Actions ---
    const handleAddCategory = async () => {
        if (!menuName.trim()) return toast.error("Name is required");
        try {
            await callSoapAction('/api/restaurant-service', 'addMenu', {
                restId: restaurant.id,
                menuName: menuName,
                description: menuDesc
            });
            toast.success("Category published!");
            setShowMenuForm(false);
            setMenuName('');
            setMenuDesc('');
            fetchMyData();
        } catch (e) { toast.error("Could not add category"); }
    };

    const handleDeleteCategory = async (menuId: string) => {
        if (!confirm("Are you sure? This will delete all items in this category.")) return;
        try {
            await callSoapAction('/api/restaurant-service', 'deleteMenu', { menuId });
            toast.success("Category removed");
            fetchMyData();
        } catch (e) { toast.error("Delete failed"); }
    };

    // --- Item Actions (Atomic) ---
    const handleAddItem = async (menuId: string) => {
        const name = prompt("Enter Item Name (e.g. Coca Cola):");
        if (!name) return;
        const priceStr = prompt("Enter Price:");
        if (!priceStr) return;

        try {
            await callSoapAction('/api/restaurant-service', 'addMenuItem', {
                menuId,
                itemName: name,
                price: parseFloat(priceStr)
            });
            toast.success("Item added to menu");
            fetchMyData();
        } catch (e) { toast.error("Failed to add item"); }
    };

    const handleDeleteItem = async (menuId: string, menuItemId: string) => {
        try {
            await callSoapAction('/api/restaurant-service', 'deleteMenuItem', { menuId, menuItemId });
            toast.success("Item removed");
            fetchMyData();
        } catch (e) { toast.error("Failed to delete item"); }
    };

    const handleUpdateStock = async (menuId: string, item: any) => {
        const newStock = prompt(`Update stock for ${item.name}:`, item.stock || 0);
        if (newStock === null || newStock === "") return;

        const stockCount = parseInt(newStock);
        if (isNaN(stockCount)) return toast.error("Please enter a number");

        try {
            await callSoapAction('/api/restaurant-service', 'updateMenuItem', {
                menuId: menuId,
                menuItemId: item.id,
                itemName: item.name,
                price: item.price,
                itemDescription: "",
                stock: stockCount
            });
            toast.success("Stock updated!");
            fetchMyData();
        } catch (e) { toast.error("Update failed."); }
    };

    const handleSaveSchedule = async (newSchedule: any[]) => {
        try {
            await callSoapAction('/api/restaurant-service', 'updateSchedule', {
                restaurantId: restaurant.id,
                schedule: newSchedule
            });
            toast.success("Schedule synced!");
            fetchMyData();
        } catch (e) { toast.error("Failed to update hours"); }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Management Data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster position="top-right" />

            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <LayoutDashboard size={18} className="text-white" />
                            </div>
                            <span className="font-black text-lg tracking-tighter uppercase">Admin Panel</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('STORE')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'STORE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Store size={14} /> Store Manager
                            </button>
                            <button
                                onClick={() => setActiveTab('ORDERS')}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'ORDERS' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ShoppingBag size={14} /> Live Orders
                            </button>
                        </nav>
                    </div>

                    {restaurant && (
                        <div className="flex items-center gap-4">
                            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${restaurant.isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {restaurant.isOpen ? 'System Online' : 'System Offline'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {!restaurant ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-12">
                        <Store size={64} className="text-slate-200 mb-4" />
                        <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Restaurant Linked</h2>
                        <p className="text-slate-400 mb-8 font-medium">To start receiving orders, you must create your store profile.</p>
                        <button onClick={() => setShowCreateModal(true)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-slate-200">Create Restaurant Profile</button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'ORDERS' ? (
                            <OrderManagement />
                        ) : (
                            <>
                                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${restaurant.isOpen ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-500'}`}>
                                                {restaurant.isOpen ? 'Open' : 'Closed'}
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Store ID: {restaurant.id?.split('-')[0]}</span>
                                        </div>
                                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{restaurant.name}</h1>
                                        <p className="text-slate-500 font-medium flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {restaurant.address}</p>
                                    </div>
                                    <button className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                        <Settings size={18} /> Store Settings
                                    </button>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        {showMenuForm && (
                                            <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-200/20">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h2 className="text-xl font-black text-emerald-900 flex items-center gap-2"><PackagePlus /> New Category</h2>
                                                    <button onClick={() => setShowMenuForm(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                                                </div>
                                                <div className="space-y-4">
                                                    <input className="w-full bg-white border-2 border-emerald-200 px-5 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all" placeholder="Category Name (e.g. Burgers)" value={menuName} onChange={e => setMenuName(e.target.value)} />
                                                    <input className="w-full bg-white border-2 border-emerald-200 px-5 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all" placeholder="Description (Optional)" value={menuDesc} onChange={e => setMenuDesc(e.target.value)} />
                                                    <button onClick={handleAddCategory} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                                        <Save size={18} /> Publish Category
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-center mb-8">
                                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Menu Inventory</h2>
                                                {!showMenuForm && (
                                                    <button onClick={() => setShowMenuForm(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100">
                                                        <Plus size={16} /> Add Category
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {restaurant.menus.map((menu: any) => (
                                                    <MenuCategoryCard
                                                        key={menu.id}
                                                        menu={menu}
                                                        onDelete={handleDeleteCategory}
                                                        onAddItem={handleAddItem}
                                                        onDeleteItem={handleDeleteItem}
                                                        onUpdateStock={handleUpdateStock}
                                                        onEdit={() => toast.error("Category edit under maintenance")}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <ScheduleManager schedule={restaurant.schedule} onSave={handleSaveSchedule} />
                                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                                            <MessageSquare className="absolute -right-4 -top-4 text-white/5 group-hover:scale-110 transition-transform" size={120} />
                                            <div className="relative z-10">
                                                <h3 className="text-lg font-black mb-2 text-emerald-400 flex items-center gap-2 tracking-tight uppercase">
                                                    <ClipboardList size={18} /> Management Mode
                                                </h3>
                                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                                    Stock updates and operational hours are reflected instantly on the customer-facing app.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <CreateRestaurantModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchMyData}
            />
        </div>
    );
};

export default AdminDashboard;