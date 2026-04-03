import React, { useEffect, useState } from 'react';
import {
    Terminal, ShieldAlert, Users, Database,
    Activity, Search, RefreshCw, Loader2, Key
} from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
import toast, { Toaster } from 'react-hot-toast';

// Define the User interface locally to match the SOAP response
interface User {
    fullName: string;
    email: string;
    tier: 'USER' | 'ADMIN' | 'DEVELOPER';
    phone?: string;
    address?: string;
}

const DevDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);

    // 1. Fetch Users from Backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await callSoapAction<User[]>('/api/user-service', 'getAllUsers');

            // Normalize the response into an array
            const userList = Array.isArray(data) ? data : data ? [data] : [];
            setUsers(userList);
            toast.success(`Synced ${userList.length} user records`);
        } catch (err: any) {
            console.error("Fetch Error:", err);
            toast.error(`Fetch Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Update User Tier by EMAIL
    const handleTierChange = async (email: string, newTier: string) => {
        const confirmMsg = `Are you sure you want to change permissions for ${email} to ${newTier}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            setUpdatingEmail(email);
            const response = await callSoapAction<string>(
                '/api/user-service',
                'updateUserTierByEmail',
                { email, newTier }
            );

            if (response?.includes("SUCCESS")) {
                toast.success(`Access updated for ${email}`);
                // Update local state immediately so UI feels snappy
                setUsers(prev => prev.map(u =>
                    u.email === email ? { ...u, tier: newTier as any } : u
                ));
            }
        } catch (err: any) {
            toast.error(`Update Failed: ${err.message}`);
        } finally {
            setUpdatingEmail(null);
        }
    };

    // Filter logic for the search bar
    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-600 p-8 font-mono">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-10 border-b border-slate-200 pb-6 flex justify-between items-end">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                            <Terminal className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Developer Console</h1>
                            <p className="text-slate-500 text-sm font-sans flex items-center gap-2">
                                System 2.0.26-ALPHA
                                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Connected
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-sans font-bold hover:bg-slate-50 transition shadow-sm disabled:opacity-50 active:scale-95"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        {loading ? 'Synchronizing...' : 'Sync XML Data'}
                    </button>
                </header>

                {/* System Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-sans">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600">
                            <Activity size={18} />
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">SOAP API Status</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">OPERATIONAL</div>
                        <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-amber-600">
                            <Database size={18} />
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">XML Data Store</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">{users.length} Records</div>
                        <p className="text-xs text-slate-400 mt-2 font-mono">Source: target/users.xml</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-rose-600">
                            <ShieldAlert size={18} />
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Security Layer</span>
                        </div>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">Active</div>
                        <p className="text-xs text-slate-400 mt-2 font-mono">@JsonIgnore on PasswordHash</p>
                    </div>
                </div>

                {/* Main Table Console */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                    <div className="p-5 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200">
                        <span className="flex items-center gap-2 text-slate-900 font-bold font-sans">
                            <Users size={20} className="text-indigo-600" />
                            User Authorization Matrix
                        </span>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by email or name..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="p-5 border-b border-slate-100">Auth Token Key</th>
                                    <th className="p-5 border-b border-slate-100">Identity Details</th>
                                    <th className="p-5 border-b border-slate-100 text-center">Tier Status</th>
                                    <th className="p-5 border-b border-slate-100 text-right">Access Control</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-24 text-center">
                                            <Loader2 className="mx-auto animate-spin text-indigo-500 mb-4" size={40} />
                                            <p className="text-slate-400 font-sans font-medium animate-pulse">Requesting SOAP Payload...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center text-slate-400 font-sans italic">
                                            No users found matching the filter criteria.
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((user) => (
                                    <tr key={user.email} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50 last:border-0">
                                        <td className="p-5 font-mono text-[11px] text-indigo-500 font-bold">
                                            <div className="flex items-center gap-2 bg-indigo-50/50 w-fit px-2 py-1 rounded">
                                                <Key size={12} />
                                                HIDDEN_UUID
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-sans font-bold text-slate-900 text-base">{user.fullName}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider inline-flex items-center gap-2 ${user.tier === 'DEVELOPER' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                user.tier === 'ADMIN' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.tier === 'DEVELOPER' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' :
                                                    user.tier === 'ADMIN' ? 'bg-orange-500' : 'bg-slate-400'
                                                    }`} />
                                                {user.tier}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <select
                                                    disabled={updatingEmail === user.email}
                                                    value={user.tier}
                                                    onChange={(e) => handleTierChange(user.email, e.target.value)}
                                                    className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-xs font-sans font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer hover:border-slate-300 transition-all disabled:opacity-50 shadow-sm"
                                                >
                                                    <option value="USER">Standard User</option>
                                                    <option value="ADMIN">Administrator</option>
                                                    <option value="DEVELOPER">System Dev</option>
                                                </select>
                                                {updatingEmail === user.email && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="p-4 bg-slate-900 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3 px-8">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                XML_STORAGE_CONNECTED
                            </span>
                            <span>ENCRYPTION: AES-256 (JWT)</span>
                        </div>
                        <span className="text-slate-500 italic">Dev Console Access Restricted to UserLevel.DEVELOPER</span>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default DevDashboard;