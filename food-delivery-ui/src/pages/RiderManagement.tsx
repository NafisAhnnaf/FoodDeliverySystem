import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldCheck, Phone, CreditCard, Loader2 } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import toast, { Toaster } from 'react-hot-toast';

export const RiderManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedUserId, setSelectedUserId] = useState('');
    const [license, setLicense] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [userData, riderData] = await Promise.all([
                callSoapAction('/api/user-service', 'getAllUsers'),
                callSoapAction('/api/delivery-service', 'getAllRiders')
            ]);
            console.log("Fetched riders:", riderData);
            setUsers(Array.isArray(userData) ? userData : (userData ? [userData] : []));
            setRiders(Array.isArray(riderData) ? riderData : (riderData ? [riderData] : []));
        } catch (e) {
            toast.error("Error loading personnel data");
        } finally {
            setLoading(false);
        }
    };

    const handleAppoint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !license) return toast.error("Please fill all fields");

        setSubmitting(true);
        try {
            await callSoapAction('/api/delivery-service', 'appointRider', {
                userEmail: selectedUserId,
                licenseNumber: license
            });
            toast.success("Rider appointed successfully!");
            setSelectedUserId('');
            setLicense('');
            fetchData();
        } catch (err) {
            toast.error("Failed to appoint rider");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <Toaster />
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rider Fleet</h1>
                    <p className="text-slate-500 font-medium">Onboard and manage your delivery personnel.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add Rider Form */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleAppoint} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <UserPlus className="text-orange-500" size={20} />
                                <h2 className="font-black text-slate-900 uppercase text-xs tracking-widest">Appoint Rider</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Select User</label>
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Choose User...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.email}>{u.fullName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">License Number</label>
                                    <input
                                        type="text"
                                        value={license}
                                        onChange={(e) => setLicense(e.target.value)}
                                        placeholder="e.g. DHAKA-12345"
                                        className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Appointing...' : 'Confirm Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Rider List */}
                    <div className="lg:col-span-2">
                        <div className="grid gap-4">
                            {riders.map(rider => (
                                <div key={rider.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400">
                                            {rider.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900">{rider.fullName}</h3>
                                            <div className="flex gap-4 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                    <Phone size={10} /> {rider.phone}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                    <CreditCard size={10} /> {rider.licenseNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${rider.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {rider.available === "true" ? 'Available' : 'On Trip'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};