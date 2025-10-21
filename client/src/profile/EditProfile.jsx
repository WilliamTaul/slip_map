import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../helpers/AuthContext';

export function EditProfile() {
    const { userId, userRole, api, updateUserRole } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({})
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess({});
        if (userRole === 'onboarding') {
            try {
                const res = await api.post("/api/user-profile/new", {
                    firstName: firstName,
                    lastName: lastName
                });
                setSubmitted(true);
                setSuccess({submit: "Successfully updated!"});
            } catch (err) {
                if (err.response && err.response.data && err.response.data.error) {
                    setErrors(err.response.data.error);
                } else {
                    console.error("Edit Profile Error:", err.message);
                }
            }
        } else {
            try {
                const res = await api.post("/api/user-profile/edit", {
                    firstName: firstName,
                    lastName: lastName
                });
                setSubmitted(true);
                setSuccess({submit: "Successfully updated!"});
            } catch (err) {
                if (err.response && err.response.data && err.response.data.error) {
                    setErrors(err.response.data.error);
                } else {
                    console.error("Edit Profile Error:", err.message);
                }
            }
        }
    }

    useEffect (() => {
        const handleUpdateRole = async () => {
            if (userRole === 'onboarding' && submitted === true) {
                try {
                    const update = await api.post("/auth/update-role", {
                        role: 'user'
                    });
                    if (update) {
                        await api.post('/api/message-board/add-to-default', {
                            userId: userId
                        })
                        updateUserRole('user')
                        navigate('/');
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

    useEffect(() => {
        // Load user profile info to populate the fields
        const loadProfileInfo = async () => {
            if (userRole === 'onboarding') return;
            try {
                const res = await api.get("/api/user-profile/info");
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
            } catch (err) {
                console.err("Error loading profile info:", err);
            }
        }
        loadProfileInfo();
    }, [])

    return (
    <div className='form-wrapper'>
      <h1 style={{textAlign: "center"}}>Update Profile</h1>
      {success.submit && <h5 style={{textAlign: "center"}}>{success.submit}</h5>}
      <form onSubmit={handleSubmit} className='new-item-form'>
        <div className="form-row">
            <label htmlFor="firstName">First Name</label>
             {errors.firstName && 
              <p className='error-text'>{errors.firstName}</p>
             }
            <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" />
            
        </div>
        <div className='form-row'>
            <label htmlFor="lastName">Last Name</label>
            {errors.lastName && 
              <p className='error-text'>{errors.lastName}</p>
             }
            <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" />
        </div>
        <button className='btn'>Submit Changes</button>
      </form>
    </div>
    );
}