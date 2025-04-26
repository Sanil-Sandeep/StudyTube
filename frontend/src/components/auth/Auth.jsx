import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { AUTH_ENDPOINTS } from '../../config/apiConfig';
import { useToast } from '../common/Toast';

const Auth = () => {
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ 
        firstName: '',
        lastName: '',
        username: '', 
        email: '', 
        password: '',
        role: 'BEGINNER'
    });
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Add animation effect when component mounts
    useEffect(() => {
        const container = document.querySelector('.auth-container');
        setTimeout(() => {
            container.classList.add('show');
        }, 100);
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": loginData.email,
                    "password": loginData.password
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (error) {
                data = { message: `Error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                localStorage.setItem('token', data.token);
                addToast('Login successful!', 'success');
                navigate('/Profile');
            } else {
                addToast(data.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during login. Please try again.', 'error');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            let data;
            try {
                data = await response.json();
            } catch (error) {
                data = { message: `Error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                addToast('Registration successful! Please login.', 'success');
                setIsActive(false); // Switch back to login form
            } else {
                addToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during registration. Please try again.', 'error');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-DarkColor/5 via-indigo-50 to-accent-1/5 p-4">
            <div className={`auth-container max-w-5xl w-full bg-surface-light rounded-2xl shadow-soft overflow-hidden transition-opacity duration-500 opacity-0 transform`}>
                <div className="flex flex-col md:flex-row">
                    {/* Left side - Banner/Info Panel */}
                    <div className="md:w-2/5 bg-gradient-to-br from-DarkColor to-accent-1 text-white p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute w-40 h-40 bg-white opacity-10 rounded-full -top-10 -left-10"></div>
                            <div className="absolute w-64 h-64 bg-white opacity-5 rounded-full -bottom-20 -right-20"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">{isActive ? 'Already a member?' : 'New here?'}</h2>
                            <p className="text-white opacity-80 mb-8">
                                {isActive 
                                    ? 'Sign in to access your account, track your progress and continue learning.' 
                                    : 'Join our community and start your learning journey today with personalized courses and expert guidance.'}
                            </p>
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-DarkColor transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            >
                                {isActive ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>
                    </div>

                    {/* Right side - Form Panel */}
                    <div className="md:w-3/5 p-8 md:p-12">
                        <div className={`transition-all duration-500 transform ${isActive ? 'hidden' : 'block'}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                                <div className="flex space-x-2">
                                    <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition">
                                        <i className='bx bxl-google'></i>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition">
                                        <i className='bx bxl-github'></i>
                                    </a>
                                </div>
                            </div>
                            
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <i className='bx bxs-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                        <input 
                                            type="email" 
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800">Forgot password?</a>
                                    </div>
                                    <div className="relative">
                                        <i className='bx bxs-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                        <input 
                                            type="password" 
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account? 
                                    <button 
                                        onClick={() => setIsActive(true)}
                                        className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>

                        <div className={`transition-all duration-500 transform ${isActive ? 'block' : 'hidden'}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                                <div className="flex space-x-2">
                                    <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition">
                                        <i className='bx bxl-google'></i>
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition">
                                        <i className='bx bxl-github'></i>
                                    </a>
                                </div>
                            </div>
                            
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="relative">
                                            <i className='bx bx-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                            <input 
                                                type="text" 
                                                value={registerData.firstName}
                                                onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                                                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                placeholder="First name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <div className="relative">
                                            <i className='bx bx-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                            <input 
                                                type="text" 
                                                value={registerData.lastName}
                                                onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                                                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <div className="relative">
                                        <i className='bx bx-at absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                        <input 
                                            type="text" 
                                            value={registerData.username}
                                            onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="username"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <i className='bx bxs-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                        <input 
                                            type="email" 
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <i className='bx bxs-lock-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
                                        <input 
                                            type="password" 
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                            className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? 
                                    <button 
                                        onClick={() => setIsActive(false)}
                                        className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add some CSS for animations */}
            <style jsx>{`
                .auth-container.show {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default Auth;