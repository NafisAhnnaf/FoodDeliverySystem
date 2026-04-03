import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, MapPin, Clock } from "lucide-react";
import { callSoapAction } from "../utils/soapClient";

interface Restaurant {
    id: string;
    name: string;
    address: string;
}

export default function Restaurants() {
    const [list, setList] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchList = async () => {
            try {
                setLoading(true);
                // The backend returns a single object if there's only 1 item, 
                // or an array if there are many. We wrap it in [].flat() to be safe.
                const fetched = await callSoapAction<Restaurant | Restaurant[]>(
                    '/api/restaurant-service',
                    'getAllRestaurants'
                );
                console.log(fetched);

                if (fetched) {
                    const normalizedList = Array.isArray(fetched) ? fetched : [fetched];
                    setList(normalizedList);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Nearby Restaurants</h2>
                    <p className="text-gray-500">Discover the best food in your area</p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                    {list.length} Places Found
                </div>
            </header>

            {loading ? (
                /* Skeleton Loading State */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse border p-4 rounded-xl">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : list.length > 0 ? (
                /* Data Display */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {list.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                            className="group border border-gray-100 p-4 rounded-2xl hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer bg-white"
                        >
                            <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                                <Utensils size={48} className="text-gray-300 group-hover:scale-110 transition-transform" />
                                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold">
                                    <Clock size={12} className="text-orange-500" /> 20-30 min
                                </div>
                            </div>

                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-orange-600 transition-colors">
                                {restaurant.name}
                            </h3>

                            <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="truncate">{restaurant.address}</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Free Delivery</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">OPEN</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-20">
                    <Utensils size={64} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-xl text-gray-500">No restaurants found in your area.</p>
                </div>
            )}
        </div>
    );
}