import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Restaurants from './components/Restaurants'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DevDashboard from './pages/DevDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './lib/AuthContext'
import useAuth from './hooks/useAuth'
import Profile from './pages/Profile'
import { RestaurantDetails } from './pages/RestaurantDetails'
import { CartProvider } from './lib/CartContext'
import TrackOrder from './pages/TrackOrder'
import { RiderManagement } from './pages/RiderManagement'

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/developer" element={<DevDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rider" element={<RiderManagement />} />
            <Route path="/track/:id" element={<TrackOrder />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App