import { useState } from 'react';
import axios from 'axios';
import "../public/styles.css";

export function Register({setShowRegister}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/auth/register", {
                username: username,
                password: password
            })

            const { token, refreshToken } = res.data;
            console.log("Token: ", token);
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
            <h1>Register Form</h1>
            <form onSubmit={handleRegister} className='new-item-form'>
                <label htmlFor="username">Username 
                  <input value={username} onChange={e => setUsername(e.target.value)} type="text" id="username"/>
                </label>
                <label htmlFor="password">Password
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password" />
                </label>
                <label htmlFor="matchPassword">Confirm Password
                  <input value={matchPassword} onChange={e => setMatchPassword(e.target.value)} type="password" id="matchPassword"/>
                </label>
                <button className="btn">Register</button>
            </form>
        </>
    )
}