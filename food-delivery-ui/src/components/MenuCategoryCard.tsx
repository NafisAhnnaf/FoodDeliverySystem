import React from 'react';
import { Trash2, Edit3, Plus, GripVertical, Package } from 'lucide-react';

export const MenuCategoryCard = ({ menu, onEdit, onDelete, onAddItem, onDeleteItem, onUpdateStock }: any) => {
    const items = menu.menuItems ? (Array.isArray(menu.menuItems) ? menu.menuItems : [menu.menuItems]) : [];

    return (
        <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/30 group hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <GripVertical size={20} className="text-slate-300 cursor-grab" />
                    <div>
                        <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{menu.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{menu.description || 'No description'}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(menu)} className="p-1.5 text-slate-400 hover:text-emerald-500"><Edit3 size={16} /></button>
                    <button onClick={() => onDelete(menu.id)} className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item: any) => (
                    <div key={item.id} className="flex flex-col py-2 border-b border-white last:border-0 group/item">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600 font-bold">{item.name}</span>
                            <div className="flex items-center gap-3">
                                {/* Stock Badge */}
                                <button
                                    onClick={() => onUpdateStock(menu.id, item)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-all ${(item.stock || 0) > 0
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                        }`}
                                >
                                    <Package size={10} />
                                    {item.stock || 0}
                                </button>

                                <span className="text-xs font-black text-slate-900">${item.price}</span>

                                <button
                                    onClick={() => onDeleteItem(menu.id, item.id)}
                                    className="opacity-0 group-hover/item:opacity-100 text-rose-300 hover:text-rose-500 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => onAddItem(menu.id)}
                    className="w-full mt-2 py-2 border border-dashed border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase hover:border-emerald-200 hover:text-emerald-500 transition-all flex items-center justify-center gap-1"
                >
                    <Plus size={12} /> Add Item
                </button>
            </div>
        </div>
    );
};