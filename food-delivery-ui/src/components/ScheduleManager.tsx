import React, { useState, useEffect } from 'react';
import { Clock, Save, Trash2, Plus } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const ScheduleManager = ({ schedule, onSave }: any) => {
    const [tempSchedule, setTempSchedule] = useState<any[]>([]);

    useEffect(() => {
        if (schedule) {
            // SOAP normalization: Ensure we always have an array
            const normalized = Array.isArray(schedule) ? schedule : [schedule];
            setTempSchedule(normalized);
        }
    }, [schedule]);

    const updateEntry = (index: number, field: string, value: string) => {
        const updated = [...tempSchedule];
        updated[index] = { ...updated[index], [field]: value };
        setTempSchedule(updated);
    };

    const handleAddDay = () => {
        // Use keys that match Java fields: day, opensAt, closesAt
        setTempSchedule([...tempSchedule, {
            day: 'MONDAY',
            opensAt: '09:00',
            closesAt: '22:00'
        }]);
    };

    const handleRemoveDay = (index: number) => {
        setTempSchedule(tempSchedule.filter((_, idx) => idx !== index));
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black flex items-center gap-2">
                    <Clock size={20} className="text-emerald-500" /> Hours
                </h2>
                <button
                    onClick={() => onSave(tempSchedule)}
                    className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 shadow-lg transition-all active:scale-95"
                    title="Save Schedule"
                >
                    <Save size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {tempSchedule.map((h, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex justify-between">
                            {/* Key changed to 'day' */}
                            <select
                                value={h.day || 'MONDAY'}
                                onChange={(e) => updateEntry(i, 'day', e.target.value)}
                                className="bg-transparent font-black text-[10px] uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
                            >
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <button
                                onClick={() => handleRemoveDay(i)}
                                className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            {/* Key changed to 'opensAt' */}
                            <div className="flex-1 space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Opens</label>
                                <input
                                    type="time"
                                    value={h.opensAt || '09:00'}
                                    onChange={(e) => updateEntry(i, 'opensAt', e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg outline-none focus:border-emerald-500"
                                />
                            </div>
                            {/* Key changed to 'closesAt' */}
                            <div className="flex-1 space-y-1">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Closes</label>
                                <input
                                    type="time"
                                    value={h.closesAt || '22:00'}
                                    onChange={(e) => updateEntry(i, 'closesAt', e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-xs font-bold p-2 rounded-lg outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddDay}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black uppercase hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Day
                </button>
            </div>
        </div>
    );
};