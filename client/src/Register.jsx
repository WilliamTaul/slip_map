import { useState } from 'react';
import axios from 'axios';
import "../public/styles.css";

export function Register({setShowRegister}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/auth/register", {
                username: username,
                password: password,
                matchPassword: matchPassword
            })

            const { token, refreshToken } = res.data;
            console.log("Token: ", token);
            console.log("Refresh Token: ", refreshToken);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrors(err.response.data.errors)
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("Register Error:", err.message);
            }
        }
    }

    return (
        <>
            <h1>Register Form</h1>
            <form onSubmit={handleRegister} className='new-item-form'>
                <div className="form-row">
                    {errors.username && <p className='error-text'>{ errors.username }</p>}
                    <label htmlFor="username">Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} type="text" id="username"/>
                </div>
                <div className='form-row'>
                  <label htmlFor="password">Password</label>
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password" />
                  {errors.password && <p className='error-text'>{ errors.password }</p>}  
                </div>
                <div className='form-row'>
                  <label htmlFor="matchPassword">Confirm Password</label>
                  <input value={matchPassword} onChange={e => setMatchPassword(e.target.value)} type="password" id="matchPassword"/>
                </div>
                <button className="btn">Register</button>
            </form>
        </>
    )
}