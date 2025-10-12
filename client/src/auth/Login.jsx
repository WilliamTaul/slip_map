import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';

import "../styles.css";

export function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const credentials = {
              username: username,
              password: password,
            };
            await login(credentials);
            navigate("/");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setUsername("");
                setPassword("");
                setErrors(err.response.data.error);
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
              {errors.login &&
                <div>
                  <p className='error-text'>{errors.login}</p>
                </div>
              }
              <div className='form-row inline'>
                <div className='col-md-6'>
                  <button className="btn" style={{width: "100%"}}>Login</button>
                </div>
                <div className='col-md-6'>
                  <Link className="btn btn-danger" to="/" style={{width: "100%", textAlign: "center"}}>Cancel</Link>
                </div>
              </div>
              <div className='form-row'>
                <label htmlFor="register" style={{textAlign: "center"}}>Don't have an account?</label>
                <button onClick={() => navigate('/register')} className='btn' style={{width: "100%"}}>Register</button>
              </div>
            </form>
          </div>
        </>  
    )
}