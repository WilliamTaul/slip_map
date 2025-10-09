import { useState } from 'react';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';

export function Message({ boardId }) {
    const { userId } = useAuth();
    const { socket } = useSocket();

    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;
        socket.emit('chatMessage', {senderId: userId, content: message, boardId: boardId});

        setMessage("");
    }

    return (
        <>
          <div className={styles['message-row']}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} 
             placeholder="Start Typing..." className={styles['message-content']} />
            <button onClick={() => handleSend()} className={styles['message-button']}>Send</button>
          </div>
        </>
    );
}