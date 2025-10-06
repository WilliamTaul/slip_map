import { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const api = axios.create({
    withCredentials: true,
    });

    api.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('auth/token')) {
                originalRequest._retry = true;

                try {
                    const res = await api.post('http://localhost:3001/auth/token');
                    
                    const newAccessToken = res.data.token;
                    setAccessToken(newAccessToken)

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
            
            return Promise.reject(error);
        }
    );

    const register = async (credentials) => {
        try {
            const res = await api.post("http://localhost:3001/auth/register", {
                username: credentials.username,
                password: credentials.password,
                matchPassword: credentials.matchPassword
            });
            const token = res.data.token;
            const decoded = jwtDecode(token);
            setAccessToken(token);
            setIsLoggedIn(true);
            setUserId(decoded.id);
            setUserRole(decoded.role);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("Login Error:", err.message);
            }
            throw err;
        }
    };

    const login = async (credentials) => {
        try {
            const res = await api.post("http://localhost:3001/auth/login", {
                username: credentials.username,
                password: credentials.password,
            });
            const token = res.data.token;
            const decoded = jwtDecode(token);
            console.log("User ID:", decoded.id);
            console.log("user Role: ", decoded.role);
            setAccessToken(token);
            setIsLoggedIn(true);
            setUserId(decoded.id);
            setUserRole(decoded.role);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("Login Error:", err.message);
            }
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post("http://localhost:3001/auth/logout");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("Login Error:", err.message);
            }
        }
        setAccessToken(null);
        setIsLoggedIn(false);
        setUserId(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, isLoggedIn, api, userId, userRole, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}