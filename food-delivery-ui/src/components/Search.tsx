import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Utensils } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (val: string) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }

        try {
            const data = await callSoapAction('/api/restaurant-service', 'searchRestaurants', { keyword: val });
            setResults(Array.isArray(data) ? data : [data].filter(Boolean));
            setIsOpen(true);
        } catch (e) {
            console.error("Search failed", e);
        }
    };

    const selectMatch = (restaurantId: string) => {
        setIsOpen(false);
        setQuery("");
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for kebabs, pizza..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
                />
            </div>

            {/* THE DANGLING CURTAIN */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2">
                    <div className="max-h-60 overflow-y-auto">
                        {results.map((match, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectMatch(match.restaurantId)}
                                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-emerald-50 transition-colors text-left border-b border-slate-50 last:border-0"
                            >
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Utensils size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{match.matchText}</p>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Click to view restaurant</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;