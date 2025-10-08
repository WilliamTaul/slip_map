import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';
import { Message } from './Message.jsx';

export function MessageBoard() {
    const { boardId } = useParams();
    const { userId, userRole, api } = useAuth();
    const [messages, setMessages] = useState([]);
    console.log(boardId)

    useEffect(() => {
        const getMessages = async (boardId) => {
            console.log("use effect message board");
            try {
                console.log("BoardId:",boardId);
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


    return (
        <>
          <div className={styles['message-board']}>
            {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
          </div>
          <Message></Message>
        </>
    );
}