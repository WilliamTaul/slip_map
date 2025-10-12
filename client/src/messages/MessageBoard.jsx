import { useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';
import { Message } from './Message.jsx';

export function MessageBoard() {
    const { socket } = useSocket();
    const { boardId } = useParams();
    const { userId, accessToken, api } = useAuth();
    const [messages, setMessages] = useState([]);
    const [boardTitle, setBoardTitle] = useState("");
    const boardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve messages from database
        const getMessages = async (boardId) => {
            console.log("get messages")
            try {
                const res = await api.get(`/api/message-board/${boardId}/messages`);
                setMessages(res.data);
                console.log(res.data)
            } catch (err) {
                console.error("Error fetching messages: ", err.response);
            }
        };
        if (boardId) {
                getMessages(boardId);
            }
    }, [boardId, accessToken]);

    useEffect(() => {
        // Retrieve information about the specific board
        const getBoard = async (boardId) => {
            try {
                const res = await api.get(`/api/message-board/${boardId}`);
                setBoardTitle(res.data.title);                
            } catch (err) {
                console.error("Error fetching board info: ", err.response);
            } 
        }
        if (boardId) {
            getBoard(boardId);
        }
    }, [boardId, accessToken]);

    useEffect(() => {
        // Auto scroll to bottom when new message is received
        if (boardRef.current) {
            boardRef.current.scrollTop = boardRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        // track socket activity
        if (!socket) return;
        const handleChatMessage = (message) => {
            setMessages(prev => [...prev, message]);
        }
        socket.on('chatMessage', handleChatMessage);
        return () => {
            socket.off('chatMessage', handleChatMessage);
        };

    }, [socket]);

    useEffect(() => {
        // pop messages if too many are in array
        if (messages.length > 40) {
            const trimmed = messages.slice(-40);
            setMessages(trimmed);
        }
    }, [messages]);

    if (!socket) {
        return <div>Loading...</div>
    }

    return (
        <>
          <div className={styles['message-board-title-wrapper']}>
            <div>
              <button onClick={() => navigate('/message-boards')} className='btn btn-danger' style={{marginBottom: "0.1em"}}
              >Boards</button>
            </div>
            <div style={{textAlign: "center", flex: "1 1 auto"}}>
              <h1 className={styles['message-board-title']}>{boardTitle}</h1>
            </div>
          </div>
          <div className={styles['message-board']} ref={boardRef}>
            <ul className={styles['message-list']}>
              {messages.map(msg => 
                  <li style={{ alignSelf: userId === msg.senderId ? "flex-end" : "flex-start"}}
                  key={msg._id}><strong>{msg.firstName}:</strong><br/>{msg.content}</li>
                )}
            </ul>
          </div> 
          <Message boardId={boardId}></Message>
        </>
    );
}