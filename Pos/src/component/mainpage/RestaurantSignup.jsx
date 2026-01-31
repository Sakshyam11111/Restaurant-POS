import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Image1 from "../../assets/Login.png";
import Logo from "../../assets/Logo.webp";

export default function RestaurantSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleClose = () => {
        navigate('/joinus');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long!');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.staffSignup({
                email,
                password,
                confirmPassword,
                fullName
            });

            toast.success(response.message || 'Account created successfully!');

            login(response.data.user, response.data.token, 'staff');

            setTimeout(() => {
                navigate('/pos');
            }, 500);
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-center" />
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name field */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                                style={{ '--tw-ring-color': '#487AA4' }}
                                onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                disabled={loading}
                            />
                        </div>

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
                                    placeholder="At least 6 characters"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
                                    onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                    required
                                    disabled={loading}
                                    minLength={6}
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
                                    placeholder="Re-enter password"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition pr-12"
                                    onFocus={(e) => (e.target.style.borderColor = '#487AA4')}
                                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Signup button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #487AA4 0%, #386184 100%)' }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

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
                    </form>
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