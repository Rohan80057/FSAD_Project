import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // In real app, you would validate token with backend here
            // For now, we assume if token exists, we are logged in (or we decode it)
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                setToken(data.token);
                setUser(data);
                navigate('/');
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (err) {
            return { success: false, error: 'Server Error' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                setToken(data.token);
                setUser(data);
                navigate('/');
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (err) {
            return { success: false, error: 'Server Error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
