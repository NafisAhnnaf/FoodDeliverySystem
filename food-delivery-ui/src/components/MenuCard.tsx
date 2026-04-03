import { Edit3, Trash2 } from 'lucide-react';

export const MenuCard = ({ menu, onEdit, onDelete }: any) => (
    <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/30 group hover:border-emerald-200 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{menu.name}</p>
                <span className="text-[10px] font-bold text-slate-400">
                    {(menu.menuItems ? (Array.isArray(menu.menuItems) ? menu.menuItems.length : 1) : 0)} Items
                </span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(menu)} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md">
                    <Edit3 size={16} />
                </button>
                <button onClick={() => onDelete(menu.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
        <div className="space-y-1.5">
            {(Array.isArray(menu.menuItems) ? menu.menuItems : (menu.menuItems ? [menu.menuItems] : [])).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-white last:border-0">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="font-black text-slate-400">${item.price}</span>
                </div>
            ))}
        </div>
    </div>
);