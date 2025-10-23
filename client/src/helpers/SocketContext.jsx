import {createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'

export const SocketContext = createContext(null);

export function useSocket() {
    return useContext(SocketContext)
}

export default function SocketProvider({ children }) {
    const { isLoggedIn, accessToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const socketIo = io(`${import.meta.env.VITE_BACKEND_URL}`, {
            auth: {token: accessToken}
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
            setSocket(null);
        }

    }, [isLoggedIn, accessToken]);
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}