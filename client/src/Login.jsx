import { useState } from 'react';
import axios from 'axios'
import "../public/styles.css";

export function Login({setActiveState, activeState}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/auth/login", {
                username: username,
                password: password
            });

            const { token, refreshToken } = res.data;
            console.log("Token:", token);    
            console.log("Refresh Token: ", refreshToken);


        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("Login Error:", err.message);
            }
        }
    }

    return (
        <>
          <h1>Login Form</h1>
          <form onSubmit={handleLogin} className="new-item-form">
            <label htmlFor="username">Username
              <input value={username} onChange={e => setUsername(e.target.value)} type="text" id="username"/>
            </label>
            <label htmlFor="password">Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password"/>
            </label>
            <button className="btn">Login</button>
          </form>
          <button className='btn btn-danger' onClick={() => setShowLogin(false)}>Cancel</button>
        </>  
    )
}