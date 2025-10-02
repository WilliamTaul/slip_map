import { useState } from 'react';
import { Link } from 'react-router-dom';
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

            const token= res.data.token;
            localStorage.setItem('accessToken', token);


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
          
          <div className='form-wrapper'>
            <h1 style={{textAlign: "center"}}>Existing User</h1>
            <form onSubmit={handleLogin} className="new-item-form">
              <div className='form-row'>
                <label htmlFor="username">Username</label>
                  <input value={username} onChange={e => setUsername(e.target.value)} type="text" id="username"/>
              </div>
              <div className='form-row'>
                <label htmlFor="password">Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password"/>
              </div>
              <div className='form-row inline'>
                <div className='col-md-6'>
                  <button className="btn" style={{width: "100%"}}>Login</button>
                </div>
                <div className='col-md-6'>
                  <Link className="btn btn-danger" to="/" style={{width: "100%", textAlign: "center"}}>Cancel</Link>
                </div>
              </div>
            </form>
            
          </div>
          
        </>  
    )
}