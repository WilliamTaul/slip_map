import { useState, useEffect } from 'react';

import styles from './message.module.css';

export function SearchBar({ userProfiles, setFilteredProfiles }) {
    const [query, setQuery] = useState("");
    const filteredUsers = userProfiles.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        // set filtered profiles
        setFilteredProfiles(filteredUsers);
    }, [query, userProfiles]);

    return (
        <input
          className={styles['user-search']} 
          type="text" 
          placeholder='Search Users'
          value={query}
          onChange={e => setQuery(e.target.value)} />
    );
}