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
                console.log('Socket Disconnected');
            }
            return;
        }

        const socketIo = io('http://localhost:3000', {
            auth: {token: accessToken}
        });

        setSocket(socketIo);
        console.log('Socket Connected');

        return () => {
            socketIo.disconnect();
            setSocket(null);
            console.log('Socket Disconnected (cleanup)');
        }

    }, [isLoggedIn, accessToken]);
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}