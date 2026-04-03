import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const BaseModal = ({ isOpen, onClose, title, children }: BaseModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content Card */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-slate-900/20 transform transition-all overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BaseModal;