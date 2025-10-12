import { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';

export function MessageBoards() {
    const [messageBoards, setMessageBoards] = useState([]);
    const { socket } = useSocket();
    const { userId, api, accessToken } = useAuth();
    const  navigate  = useNavigate();

    useEffect(() => {
        // Retrieve all boards that the user has access to
        const getBoards = async (userId) => {
            try {
                const res = await api.get("http://localhost:3000/api/message-board/user");
                setMessageBoards(res.data);
            } catch (err) {
               console.error("Server Error: ", err);
            }
        }
        getBoards(userId);
    }, [accessToken]);

    return (
        <>
        <h1 style={{textAlign: "center"}}>Boards</h1>
        <div className={styles['message-boards-wrapper']}>
          <ul className={styles['message-board-list']}>
            {messageBoards.map(board =>
                <li onClick={() => navigate(`/message-board/${board._id}`)} key={board._id}>
                    {board.title}
                </li>
                
            )}
          </ul>
        </div>
        </>
    )
}