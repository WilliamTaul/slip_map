import { createContext, useState, useContext, useEffect, useMemo , useRef} from 'react';
import { useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    
    const refreshing = useRef(false);

    const navigate = useNavigate();

    const api = useMemo(() => {
        const instance = axios.create({
        withCredentials: true,
    });
    instance.interceptors.request.use(
        config => {
            if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );
    instance.interceptors.response.use(
        response => response,
        async error => {
        const originalRequest = error.config;

        const excludedPaths = [
            '/auth/login',
            '/auth/register',
            '/auth/token'
        ];

        if (excludedPaths.some(path => originalRequest.url.includes(path))) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('auth/token')) {
            originalRequest._retry = true;

            try {
            const res = await instance.post('http://localhost:3001/auth/token');

            const newAccessToken = res.data.token;
            setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            const retry = await instance(originalRequest);
            return retry;
            } catch (err) {
            return Promise.reject(err);
            }
        }

        return Promise.reject(error);
        }
    );

    return instance;
    }, [accessToken]);
    useEffect(() => {
        // keep user authenticated on page refresh if their refersh token
        // is valid
        if (refreshing.current) return;
        refreshing.current = true;
        const refreshPage = async () => {
            try {
                const res = await api.post('http://localhost:3001/auth/token');
                const token = res.data.token;
                if (token) {
                    const decoded = jwtDecode(token);
                    setAccessToken(token)
                    setIsLoggedIn(true);
                    setUserId(decoded.id);
                    setUserRole(decoded.role);
                }
                console.log("done loading auth")
                setIsAuthLoading(false);
            } catch (err) {
                setIsAuthLoading(false); 
                if (err.response && err.response.data && err.response.data.message) {
                    console.error("Server Error Message:", err.response.data.message);
                } else {
                    console.error("Login Error:", err.message);
                }
            }
        }
        refreshPage();
    }, []);

    const updateUserRole = (role) => {
        setUserRole(role);
    }
    
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
            setAccessToken(token);
            setIsLoggedIn(true);
            setUserId(decoded.id);
            setUserRole(decoded.role);
        } catch (err) {
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

    

    const authValue = useMemo(() => ({accessToken, isLoggedIn, api, 
                                      userId, userRole, isAuthLoading, register, 
                                      login, logout, updateUserRole}), 
                    [accessToken, isLoggedIn, userId, userRole, isAuthLoading]);
    return (
        <AuthContext.Provider value={ authValue }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}