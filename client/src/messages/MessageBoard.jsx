import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';
import { Message } from './Message.jsx';

export function MessageBoard() {
    const { socket } = useSocket();
    const { boardId } = useParams();
    const { userId, userRole, api } = useAuth();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const getMessages = async (boardId) => {
            try {
                const res = await api.get(`http://localhost:3000/api/message-board/${boardId}/messages`);
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching messages: ", err.response);
            }
        };
        if (boardId) {
                getMessages(boardId);
            }
    }, [boardId]);
    
    useEffect(() => {
        if (!socket) return;
        socket.on('chatMessage', (message) => {
            console.log("chat message")
            setMessages(prev => [...prev, message]);
        });
        console.log(socket)

    }, [socket]);

    if (!socket) {
        return <div>Loading...</div>
    }

    return (
        <>
          <div className={styles['message-board']}>
            {messages.map(msg => <div key={msg._id}><ul><li>{msg.content}</li></ul></div>)}
          </div>
          <Message boardId={boardId}></Message>
        </>
    );
}