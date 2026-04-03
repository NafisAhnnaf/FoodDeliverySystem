import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { User, Mail, Phone, MapPin, Lock, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { callSoapAction } from '../utils/soapClient';
// Assuming you have a signup animation JSON
import signupAnim from '../assets/Register.json';

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const result = await callSoapAction<string>(
                '/api/auth-service',
                'registerUser',
                { ...formData } // Spreading the form data object as params
            );
            console.log("Signup response:", result);

            if (result && !result.startsWith('ERROR')) {
                setSuccess(true);
                // Automatically redirect to login after a short delay
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(result?.replace('ERROR: ', '') || 'Registration failed.');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[95vh] flex items-center justify-center p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Left Side: Signup Form */}
                <div className="flex-1 p-12 md:p-16">
                    <div className="max-w-md mx-auto">
                        <header className="mb-10 text-center md:text-left">
                            <h1 className="text-4xl font-extrabold text-gray-900">Get Started</h1>
                            <p className="text-gray-500 mt-2">Create your account to start ordering.</p>
                        </header>

                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-200">
                                <AlertCircle size={20} />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200">
                                <ShieldCheck size={20} />
                                <p>Account created! Redirecting to login...</p>
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-5">
                            {[
                                { name: 'fullName', placeholder: 'Full Name', icon: User, type: 'text' },
                                { name: 'email', placeholder: 'Email Address', icon: Mail, type: 'email' },
                                { name: 'phone', placeholder: 'Phone Number', icon: Phone, type: 'tel' },
                                { name: 'address', placeholder: 'Delivery Address', icon: MapPin, type: 'text' },
                                { name: 'password', placeholder: 'Password', icon: Lock, type: 'password' },
                            ].map((field) => (
                                <div key={field.name} className="relative">
                                    <field.icon className="absolute left-4 top-4 text-gray-400" size={20} />
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder}
                                        required
                                        className="w-full px-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition"
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <UserPlus size={20} />
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        <footer className="mt-10 text-center text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                                Sign In
                            </Link>
                        </footer>
                    </div>
                </div>

                {/* Right Side: Lottie Animation (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-orange-50 p-12">
                    <Player
                        src={signupAnim}
                        autoplay
                        loop
                        style={{ height: '450px', width: '450px' }}
                    />
                </div>
            </div>
        </div>
    );
}