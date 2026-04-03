import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
// Assuming you have a login animation JSON
import loginAnim from '../assets/Login.json';
import useAuth from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(false);

        try {
            setLoading(true);
            const token = await callSoapAction<string>(
                '/api/auth-service', // Using the Vite proxy URL
                'loginUser',
                { email, password }
            );
            console.log("Login response:", token);
            if (token && !token.startsWith('ERROR')) {
                // Success: Store token and redirect
                sessionStorage.setItem('token', token);
                login(token, { fullName: '', email: '', phone: '', address: '', userLevel: 'USER' }); //
                // You might want to decode token here to get user info for Navbar
                // navigate('/');
                window.location.href = '/';
            } else {
                setError(token?.replace('ERROR: ', '') || 'Invalid credentials.');
            }
        } catch (err) {
            setError('Connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Left Side: Lottie Animation (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-orange-50 p-12">
                    <Player
                        src={loginAnim}
                        autoplay
                        loop
                        style={{ height: '400px', width: '400px' }}
                    />
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 p-12 md:p-20">
                    <div className="max-w-md mx-auto">
                        <header className="mb-10 text-center md:text-left">
                            <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back</h1>
                            <p className="text-gray-500 mt-2">Login to manage your orders and profile.</p>
                        </header>

                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-200">
                                <AlertCircle size={20} />
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full px-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full px-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <LogIn size={20} />
                                {loading ? 'Verifying...' : 'Sign In'}
                            </button>
                        </form>

                        <footer className="mt-12 text-center text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-orange-600 font-semibold hover:underline">
                                Create one now
                            </Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}