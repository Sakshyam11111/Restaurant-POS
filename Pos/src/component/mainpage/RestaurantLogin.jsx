
import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Image1 from "../../assets/Login.png";
import Logo from "../../assets/Logo.webp";

export default function RestaurantLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleClose = () => {
        navigate('/joinus');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.staffLogin({ email, password });
            
            toast.success(response.message || 'Login successful!');
            
            // Use the auth context to set user data
            login(response.data.user, response.data.token, 'staff');
            
            // Navigate to POS after short delay
            setTimeout(() => {
                navigate('/pos');
            }, 500);
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-center" />
            
            {/* Left side - Food images */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src={Image1}
                    alt="Restaurant dishes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors duration-200"
                    aria-label="Close and return to Join Us page"
                >
                    <X size={40} />
                </button>

                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <img
                            src={Logo}
                            alt="Restaurant Logo"
                            className="h-36 w-auto"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1.5">Log In</h1>
                    <p className="text-gray-600 mb-6">Log in to access your restaurant dashboard.</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@gmail.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                                style={{ '--tw-ring-color': '#487AA4' }}
                                onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
                                    onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <button 
                                type="button"
                                className="text-sm hover:opacity-80" 
                                style={{ color: '#487AA4' }}
                                disabled={loading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #487AA4 0%, #386184 100%)' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Sign up link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link
                                to="/staffsignup"
                                className="font-medium hover:opacity-80"
                                style={{ color: '#487AA4' }}
                            >
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}