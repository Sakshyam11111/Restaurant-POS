import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Image1 from "../../assets/Login.png";
import Logo from "../../assets/Logo.webp";

export default function CustomerSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/joinus');
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Sign Up form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-6 left-6 text-red-400 hover:text-red-600 transition-colors duration-200"
                    aria-label="Close and return to Join Us page"
                >
                    <X size={40} />
                </button>

                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <img
                            src={Logo}
                            alt="Customer Logo"
                            className="h-36 w-auto"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1.5 text-center">
                        Sign Up
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Sign up to access your customer dashboard.
                    </p>

                    {/* Form */}
                    <div className="space-y-2">
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
                                    placeholder="user@1234"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
                                    onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="user@1234"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
                                    onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me & forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-[#487AA4] border-gray-300 rounded focus:ring-[#487AA4]"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <button
                                className="text-sm hover:opacity-80"
                                style={{ color: '#487AA4' }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Signup button */}
                        <Link to="/customerdashboard">
                            <button
                                className="w-full text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
                                style={{ background: 'linear-gradient(135deg, #487AA4 0%, #386184 100%)' }}
                            >
                                Sign Up
                            </button>
                        </Link>

                        {/* Social signup divider */}
                        <div className="relative mt-6 mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">— or Sign Up with —</span>
                            </div>
                        </div>

                        {/* Social signup buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="text-gray-700 font-medium">Google</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span className="text-gray-700 font-medium">Facebook</span>
                            </button>
                        </div>

                        {/* Log in link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/customerlogin"
                                className="font-medium hover:opacity-80"
                                style={{ color: '#487AA4' }}
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Food images */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src={Image1}
                    alt="Food options"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}