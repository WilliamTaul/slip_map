import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';

export function EditProfile() {
    const { userRole, api, accessToken, updateUserRole } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userRole === 'onboarding') {
            try {
                const res = await api.post("http://localhost:3000/api/user-profile/new", {
                    firstName: firstName,
                    lastName: lastName
                });
                setSubmitted(true);
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
                } else {
                    console.error("New Slip Error:", err.message);
                }
            }
        }
    }

    useEffect (() => {
        const handleUpdateRole = async () => {
            if (userRole === 'onboarding' && submitted === true) {
                try {
                    const update = await api.post("http://localhost:3001/auth/update-role", {
                        role: 'user'
                    });
                    if (update) {
                        updateUserRole('user')
                    }
                } catch (err) {
                    if (err.response && err.response.data && err.response.data.message) {
                    console.error("Server Error Message:", err.response.data.message);
                    } else {
                        console.error("New Slip Error:", err.message);
                    }
                }
            }
        }
        handleUpdateRole();
    }, [submitted]);

    return (
    <div className='form-wrapper'>
      <h1 style={{textAlign: "center"}}>Update Profile</h1>
      <form onSubmit={handleSubmit} className='new-item-form'>
        <div className="form-row">
            <label htmlFor="firstName">First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" />

        </div>
        <div className='form-row'>
            <label htmlFor="lastName">Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" />
        </div>
        <button className='btn'>Submit Changes</button>
      </form>
    </div>
    );
}