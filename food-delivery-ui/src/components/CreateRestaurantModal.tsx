import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { callSoapAction } from '../utils/soapClient';
import { Loader2, Store, MapPin, Phone } from 'lucide-react';

interface CreateRestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // To refresh the dashboard after creation
}

const CreateRestaurantModal = ({ isOpen, onClose, onSuccess }: CreateRestaurantModalProps) => {
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // This calls your AuthController.createRestaurant SOAP endpoint
            await callSoapAction(`/api/restaurant-service`, 'createRestaurant', {
                name: formData.name,
                address: formData.address,
                phone: formData.phone
            });

            onSuccess(); // Triggers re-fetch in AdminDashboard
            onClose();   // Close modal
        } catch (err: any) {
            alert("Creation failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Register Restaurant">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <div className="relative">
                        <Store className="absolute left-3 top-3 text-slate-300" size={18} />
                        <input
                            required
                            type="text"
                            placeholder="e.g. The Emerald Grill"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Address Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-300" size={18} />
                        <input
                            required
                            type="text"
                            placeholder="123 Innovation Street, Dhaka"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-300" size={18} />
                        <input
                            required
                            type="tel"
                            placeholder="+880 17..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Launch My Restaurant"}
                </button>
            </form>
        </BaseModal>
    );
};

export default CreateRestaurantModal;