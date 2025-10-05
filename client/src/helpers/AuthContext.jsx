import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const login = (token) => {
        setAccessToken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setAccessToken(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ accessToken, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}