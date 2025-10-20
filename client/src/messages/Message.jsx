import { useState, useEffect } from 'react';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';

export function Message({ boardId }) {
    const { userId, api } = useAuth();
    const { socket } = useSocket();
    const [firstName, setFirstName] = useState();
    const [message, setMessage] = useState("");
    const [backspace, setBackspace] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        socket.emit('chatMessage', {senderId: userId, content: message, 
                                    boardId: boardId, firstName: firstName});

        setMessage("");
        setCharCount(0);
    }

    useEffect(() => {
      // get the users name to attach to message
      const getfirstName = async () => {
        try {
          const res = await api.get("/api/user-profile/info");
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
              if (e.key === "Backspace") setBackspace(true);
            }} onChange={(e) => {
              const input = e.target.value;
              if (input.length < 250 || backspace) {
                  setMessage(e.target.value); 
                  setBackspace(false);
                } else {
                  setMessage(input.slice(0, 250));
                  setBackspace(false);
                }
               }
              } 
             placeholder="Start Typing..." className={styles['message-content']} />
             <div style={{margin: "0.25em"}}>
              {message.length} / 250
             </div>
            <button onClick={() => handleSend()} className={styles['message-button']}>Send</button>
          </div>
        </>
    );
}