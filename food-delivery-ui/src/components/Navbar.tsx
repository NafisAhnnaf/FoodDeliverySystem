import { Home, Search, ShoppingCart, User, Terminal, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from './Search';
import useAuth from '../hooks/useAuth';
import { useCart } from '../lib/CartContext';

const Navbar = () => {
    const { cart } = useCart();
    const { isAuthenticated, user } = useAuth()
    console.log("Navbar auth state:", { isAuthenticated, user });
    return (
        <nav className="flex items-center justify-between py-4 px-6 bg-white shadow-md">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full" /> FoodDash
            </Link>

            <SearchBar />

            <div className="flex items-center gap-6">
                {user?.tier === "ADMIN" && <Link title="Admin" to="/admin"><ShieldCheck size={20} /></Link>}
                {user?.tier === "DEVELOPER" && <Link title="Dev" to="/developer"><Terminal size={20} /></Link>}
                <Link to="/cart" className="relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">{cart?.items?.length || 0}</span>
                </Link>
                {user ? (
                    <Link to={'/profile'}><User size={20} /></Link>
                ) : (
                    <Link to="/login" className="bg-orange-500 text-white px-4 py-2 rounded-lg">Login</Link>
                )}
            </div>
        </nav>
    );
};
export default Navbar;