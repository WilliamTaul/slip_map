import { useState, useEffect } from 'react';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';

export function Message({ boardId }) {
    const { userId, api } = useAuth();
    const { socket } = useSocket();
    const [firstName, setFirstName] = useState();

    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;
        socket.emit('chatMessage', {senderId: userId, content: message, 
                                    boardId: boardId, firstName: firstName});

        setMessage("");
    }

    useEffect(() => {
      // get the users name to attach to message
      const getfirstName = async () => {
        try {
          const res = await api.get("/api/user-profile/info");
          console.log("getting first name:", res.data.firstName);
          setFirstName(res.data.firstName);
        } catch (err) {

        }     
    }
      getfirstName();
    }, []);

    return (
        <>
          <div className={styles['message-row']}>
            <textarea value={message} onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }} onChange={(e) => setMessage(e.target.value)} 
             placeholder="Start Typing..." className={styles['message-content']} />
            <button onClick={() => handleSend()} className={styles['message-button']}>Send</button>
          </div>
        </>
    );
}