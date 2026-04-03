import deliveryAnim from '../assets/delivery-animation.json';
import { Player } from '@lottiefiles/react-lottie-player';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
            {/* Lottie Animation Container */}
            <div className="max-w-md mx-auto">
                <Player
                    src={deliveryAnim}
                    className="player"
                    loop
                    autoplay
                    style={{ height: '400px', width: '400px' }}
                />
            </div>

            {/* Hero Text */}
            <h1 className="text-5xl font-extrabold mt-6 text-gray-900">
                Hungry? <span className="text-orange-500">We got you.</span>
            </h1>
            <p className="text-xl text-gray-500 mt-4 max-w-lg mx-auto">
                Experience the fastest delivery from the most iconic local restaurants straight to your doorstep.
            </p>

            {/* Big Browse Button */}
            <div className="mt-10">
                <Link
                    to="/restaurants"
                    className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold px-8 py-4 rounded-full shadow-lg shadow-orange-200 transition-all transform hover:scale-105"
                >
                    <UtensilsCrossed size={24} />
                    Browse Restaurants
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
            </div>

            {/* Quick Stats / Trust Badges */}
            <div className="flex gap-8 mt-12 text-gray-400 text-sm font-medium">
                <p>✓ 250+ Restaurants</p>
                <p>✓ 20 Min Delivery</p>
                <p>✓ Secure Payment</p>
            </div>
        </div>
    );
}

export default Home;