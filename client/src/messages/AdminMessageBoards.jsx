import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'

import { useAuth } from '../helpers/AuthContext';
import { useSocket } from '../helpers/SocketContext';

import { SearchBar } from './UserSearchBar';

import styles from './message.module.css';

Modal.setAppElement('#root');

export function AdminMessageBoards() {
    const [messageBoards, setMessageBoards] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState({});
    const [selectedBoardUsers, setSelectedBoardUsers] = useState({});
    const [filterBoardUsers, setFilterBoardUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const { api, accessToken, userRole } = useAuth();
    const  navigate  = useNavigate();

    useEffect(() => {
        // navigate user away if they arent an admin
        if (userRole !== 'admin') {
            navigate('/message-boards');
        }
    }, [userRole]);

    // return null to prevent rendering if user is not admin
    if (userRole !== 'admin') return null;

    useEffect(() => {
        // get all boards on load
        const getBoards = async () => {
            try {
            const res = await api.get("/api/message-board/");
            const boardsWithCount = res.data.map(board => ({
                ...board,
                currentUserAmount: board.users.length
            }));
            setMessageBoards(boardsWithCount);
            console.log(boardsWithCount);
            } catch (err) {
            console.error(err);
            }
        };
        getBoards();
    }, [accessToken]);

    useEffect(() => {
        // Get all user profiles so they can be added to boards
        const getUserProfiles = async () => {
            try {
                const res = await api.get("/api/user-profile");
                console.log(res.data)
                setUserProfiles(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getUserProfiles();
    }, [accessToken]);

    useEffect(() => {
        // Get the users that are in the selected board & remove them from userProfiles
        if (selectedBoard && Object.keys(selectedBoard).length > 0) {
            if (userProfiles && Object.keys(userProfiles).length > 0) {
                const filter = userProfiles.filter(user => selectedBoard.users.includes(user.userId));
                setSelectedBoardUsers(filter);
                const userProfileFilter = userProfiles.filter(user =>
                    !filter.some(filtered => filtered.userId === user.userId)
                );
                setAvailableUsers(userProfileFilter);
            }
        }
    }, [selectedBoard, userProfiles])

    return (
        <>
            <h1 style={{textAlign: "center"}}>Admin Panel</h1>
            <div className={styles['message-boards-wrapper']}>
              <ul className={styles['message-board-list']}>
                {messageBoards.map(board =>
                  <li onClick={() => {
                    setSelectedBoard(board);
                    setIsOpen(true);
                  }} 
                  key={board._id}>
                    {board.title} - {board.currentUserAmount} users
                  </li>
                )}
              </ul>
              <Modal
                className={styles['message-boards-modal']}
                overlayClassName={styles['message-boards-modal-overlay']} 
                isOpen={modalIsOpen} 
                onRequestClose={() => setIsOpen(false)}
               >
                {selectedBoard && (
                <>
                  <div style={{justifyContent: "flex-end", display: "flex"}}>
                    <button className='btn btn-danger' onClick={() => setIsOpen(false)}>Close</button>
                  </div>
                  <div style={{textAlign: "center"}}><h1>{selectedBoard.title} Users</h1></div>
                  <div className='form-row inline'>
                    <div className='col-md-6'>
                        <h3>Remove Users</h3>
                        <SearchBar 
                            userProfiles={selectedBoardUsers} 
                            setFilteredProfiles={setFilterBoardUsers}>
                        </SearchBar>
                        <div className={styles['user-scroll']}>
                          <ul className={styles['user-remove-list']}>
                            {filterBoardUsers.map(user =>
                              <li key={user.userId}>
                                {user.firstName} {user.lastName}
                              </li>
                            )}
                          </ul>
                        </div>
                    </div>
                    <div className={styles['vertical-divider']}>
                        <h3>Add Users</h3>
                        <SearchBar 
                            userProfiles={availableUsers} 
                            setFilteredProfiles={setFilteredProfiles}>
                        </SearchBar>
                        <div className={styles['user-scroll']}>
                          <ul className={styles['user-add-list']}>
                            {filteredProfiles.map(user =>
                              <li key={user.userId}>
                                {user.firstName} {user.lastName}
                              </li>
                            )}
                          </ul>
                        </div>
                    </div>
                  </div>
                </>
                )}
              </Modal>
            </div>
        </>
    )
}