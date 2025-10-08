import { useState } from 'react';

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import styles from './message.module.css';
import { Message } from './Message.jsx';

export function MessageBoard() {


    return (
        <>
          <div className={styles['message-board']}>
            {}
          </div>
          <Message></Message>
        </>
    );
}