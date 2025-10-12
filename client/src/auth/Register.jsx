import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';

import "../styles.css";

export function Register() {
    const { register, api } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [matchPassword, setMatchPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const credentials = {
                username: username,
                password: password,
                matchPassword: matchPassword
            };
                        
            await register(credentials);
            navigate("/");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors)
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
                      <label htmlFor="username">Username</label>
                      <input value={username} onChange={e => setUsername(e.target.value)} type="text" id="username"/>
                  </div>
                  <div className='form-row'>
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password" />
                  </div>
                  <div className='form-row'>
                    <label htmlFor="matchPassword">Confirm Password</label>
                    <input value={matchPassword} onChange={e => setMatchPassword(e.target.value)} type="password" id="matchPassword"/>
                    {errors.username && <p className='error-text'>{ errors.username }</p>}
                    {errors.password && <p className='error-text'>{ errors.password }</p>}  
                  </div>
                  <button className="btn" style={{margin: "1rem 0", fontSize: "medium"}}>Create Account</button>
              </form>
              <button onClick={() => navigate('/login')} className='btn btn-danger' style={{width: "100%"}}>Return to login</button>
            </div>
        </>
    )
}