import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import api from './api';
import "../public/styles.css";

export function Register({setShowRegister}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("http://localhost:3001/auth/register", {
                username: username,
                password: password,
                matchPassword: matchPassword
            })

            const token = res.data.token;
            localStorage.setItem('accessToken', token)
            navigate("/");
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
            <div className="form-wrapper">
              <h1 style={{textAlign: 'center'}}>Register</h1>
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
                  <button className="btn" style={{margin: "1rem 0", fontSize: "medium"}}>Create Account</button>
              </form>
            </div>
        </>
    )
}