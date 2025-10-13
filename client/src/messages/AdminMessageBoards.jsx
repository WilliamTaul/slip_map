import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'

import { useAuth } from '../helpers/AuthContext';

import { SearchBar } from './UserSearchBar';

import styles from './message.module.css';

Modal.setAppElement('#root');

export function AdminMessageBoards() {
    const [messageBoards, setMessageBoards] = useState([]);
    const [userProfiles, setUserProfiles] = useState([]);
    const [newModalIsOpen, setNewIsOpen] = useState(false);
    const [editModalIsOpen, setEditIsOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState({});
    const [selectedBoardUsers, setSelectedBoardUsers] = useState({});
    const [filterBoardUsers, setFilterBoardUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [newBoardTitle, setNewBoardTitle] = useState("");
    const [toggleLoad, setToggleLoad] = useState(false);
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
            } catch (err) {
            console.error("ERROR", err);
            }
        };
        getBoards();
    }, []);

    useEffect(() => {
        // retrieve the updated board when adding/removing users 
        const updateBoard = async () => {
            if (selectedBoard && Object.keys(selectedBoard).length > 0) {
                const res = await api.get(`/api/message-board/${selectedBoard._id}`);
                if (res.data) {
                    setMessageBoards(prev => prev.map(board =>
                            board._id === res.data._id
                            ? { ...res.data, currentUserAmount: res.data.users.length }
                            : board
                        )
                    );
                }
            }
        }
        updateBoard();
    }, [toggleLoad]);


    useEffect(() => {
        // Get all user profiles so they can be added to boards
        const getUserProfiles = async () => {
            try {
                const res = await api.get("/api/user-profile");
                setUserProfiles(res.data);
            } catch (err) {
                console.error("ERROR", err);
            }
        }
        getUserProfiles();
    }, []);

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
    }, [selectedBoard, userProfiles]);

    const handleBoardDelete = async (boardId) => {
        if (window.confirm('This board will be permanently deleted!Continue?')) {
            try {
                const res = await api.delete(`/api/message-board/delete/${boardId}`);
                setEditIsOpen(false);
                setSelectedBoard({});
                setMessageBoards(prevBoards => prevBoards.filter(board => board._id !== boardId));
            } catch (err) {
                console.error("ERROR", err);
            }
        }
    };

    const handleNewBoard = async (e) => {
        e.preventDefault();
        if (newBoardTitle.length <= 1) return;
        try {
            const res = await api.post("/api/message-board/new", {
                title: newBoardTitle
            });
            setNewBoardTitle("");
            setNewIsOpen(false);
            setMessageBoards(prev => [...prev, {...res.data, currentUserAmount: 0}]);
        } catch (err) {
            console.error("ERRPR", err);
        }
    };

    const handleAddUser = async (user) => {
        if (!user) return;
        try {
            const res = await api.post('/api/message-board/add-user', {
                boardId: selectedBoard._id,
                userId: user.userId,
            });
            setMessageBoards(prev => prev.map(board => 
                board._id === selectedBoard._id ? {...board, 
                                                    currentUserAmount: board.currentUserAmount + 1 }
                                                : board));
            setSelectedBoardUsers(prev => [...prev, user]);
            setAvailableUsers(prev => prev.filter(filterUser => filterUser.userId !== user.userId));
            setToggleLoad(prev => !prev);
        } catch (err) {
            console.error("ERRPR", err);
        }
    };

    const handleRemoveUser = async (user) => {
        if (!user) return;
        try {
            const res = await api.delete(`/api/message-board/remove-user/${selectedBoard._id}/${user.userId}`);
            setMessageBoards(prev => prev.map(board => 
                board._id === selectedBoard._id ? {...board, 
                                                    currentUserAmount: board.currentUserAmount - 1 }
                                                : board));
            setSelectedBoardUsers(prev => prev.filter(filterUser => filterUser.userId !== user.userId));
            setAvailableUsers(prev => [...prev, user]);
            setToggleLoad(prev => !prev);
        } catch (err) {
            console.error("ERRPR", err);
        }
    };

    return (
        <>
            <h1 style={{textAlign: "center"}}>Admin Panel</h1>
            <div className={styles['horizontal-divider']}>
                <button onClick={() => setNewIsOpen(true)} className={styles['btn-add-board']}>Create Board</button>
            </div>
            <div className={styles['message-boards-wrapper']}>
              <ul className={styles['message-board-list']}>
                {messageBoards.map(board =>
                  <li onClick={() => {
                    setSelectedBoard(board);
                    setEditIsOpen(true);
                  }} 
                  key={board._id}>
                    {board.title} - {board.currentUserAmount} users
                  </li>
                )}
              </ul>
              <Modal
                className={styles['message-boards-modal']}
                overlayClassName={styles['message-boards-modal-overlay']} 
                isOpen={editModalIsOpen} 
                onRequestClose={() => setEditIsOpen(false)}
               >
                {selectedBoard && (
                <>
                  <div className='form-row inline'>
                    <div style={{flex: 1, justifyContent: "center", display: "flex", marginLeft: "4em"}}>
                        <button onClick={() => handleBoardDelete(selectedBoard._id)} className='btn btn-danger'>Delete Board</button>
                    </div>
                    <div style={{justifyContent: "flex-end", display: "flex"}}>
                        <button className='btn btn-danger' onClick={() => setEditIsOpen(false)}>Close</button>
                    </div>
                  </div>
                  <div style={{textAlign: "center"}}><h1>{selectedBoard.title} Users</h1></div>
                  <div className='form-row inline'>
                    <div className={styles['col-md-6']}>
                        <h3 style={{textAlign: "center"}}>Remove Users</h3>
                        <div style={{justifyContent: "center", display: "flex"}}>
                            <SearchBar 
                                userProfiles={selectedBoardUsers} 
                                setFilteredProfiles={setFilterBoardUsers}>
                            </SearchBar>
                        </div>
                        <div className={styles['user-scroll']}>
                          <ul className={styles['user-remove-list']}>
                            {filterBoardUsers.map(user =>
                              <li 
                                key={user.userId}
                                onClick={() => handleRemoveUser(user)}
                                >
                                    {user.firstName} {user.lastName}
                              </li>
                            )}
                          </ul>
                        </div>
                    </div>
                    <div className={styles['vertical-divider']}>
                        <h3 style={{textAlign: "center"}}>Add Users</h3>
                        <div style={{justifyContent: "center", display: "flex"}}>
                            <SearchBar 
                                userProfiles={availableUsers} 
                                setFilteredProfiles={setFilteredProfiles}>
                            </SearchBar>
                        </div>
                        <div className={styles['user-scroll']}>
                          <ul className={styles['user-add-list']}>
                            {filteredProfiles.map(user =>
                              <li 
                                key={user.userId}
                                onClick={() => handleAddUser(user)}>
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
              <Modal
                className={styles['message-board-modal-new']}
                overlayClassName={styles['message-boards-modal-overlay']} 
                isOpen={newModalIsOpen} 
                onRequestClose={() => setNewIsOpen(false)}
              >
                <h1 styles={{textAlign: "center"}}>New Board</h1>
                <div className='form-wrapper'>
                    <form onSubmit={handleNewBoard} className='new-item-form'>
                      <div className='form-row'>
                        <label style={{fontSize: '1.25rem'}} htmlFor="boardTitle">Title</label>
                        <input style={{fontSize: '1rem'}} value={newBoardTitle} onChange={e => setNewBoardTitle(e.target.value)} type="text" id="boardTitle"/>
                        <button className='btn' styles={{width: '100%'}}>Submit</button>
                      </div>
                    </form>
                </div>
              </Modal>
            </div>
        </>
    )
}