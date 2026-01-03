import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Image1 from "../../assets/Login.png";
import Logo from "../../assets/Logo.webp";

export default function RestaurantSignup() {
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
                            alt="Restaurant Logo"
                            className="h-36 w-auto"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1.5 text-center">
                        Sign Up
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Sign up to access your restaurant dashboard.
                    </p>

                    {/* Form */}
                    <div className="space-y-5">
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
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
                        <Link to="/pos">
                            <button
                                className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
                                style={{ background: 'linear-gradient(135deg, #487AA4 0%, #386184 100%)' }}
                            >
                                Sign Up
                            </button>
                        </Link>

                        {/* Log in link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link
                                to="/stafflogin"
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
                    alt="Restaurant dishes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}