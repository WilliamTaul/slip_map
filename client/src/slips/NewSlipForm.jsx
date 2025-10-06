import { useState } from 'react';
import axios from 'axios';

import { useAuth } from '../helpers/AuthContext.jsx';

import "../styles.css";

export function NewSlipForm({ activeState, setActiveState }) {
    const { accessToken, api } = useAuth();
    const [slipName, setSlipName] = useState("");
    const [slipX, setSlipX] = useState(0);
    const [slipY, setSlipY] = useState(0);
    const [slipSeason, setSlipSeason] = useState(0);
    const [slips, setSlips] = useState({});
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        setErrors(newErrors);
        if (slipName.length > 5) newErrors.slipName = "Slip name cannot be longer than 5 characters";
        if (slipX < 0) newErrors.slipX = "Slip X coordinate cannot be less than 0";
        if (slipY < 0) newErrors.slipY = "Slip Y coordinate cannot be less than 0";
        if (!["1", "2", "3"].includes(slipSeason)) newErrors.slipSeason = "Please pick a season";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        } else {
          try {
            const res = await axios.post("http://localhost:3000/api/slips/new", {
              slipName: slipName,
              slipX: slipX,
              slipY: slipY,
              season: slipSeason
            });
            console.log(res.data.message);
          } catch (err) {
            console.log(err.response.data.errors)
             if (err.response && err.response.data && err.response.data.message) {
                console.error("Server Error Message:", err.response.data.message);
            } else {
                console.error("New Slip Error:", err.message);
            }
            if (err.response.data.errors) {
              setErrors(err.response.data.errors);
            }
          }
        }
    };

    const listSlips = async () => {
        try {
          const response = await api.get('http://localhost:3000/api/slips', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response.data);
        } catch (error) {
        console.log('Fetch Error', error);
        }
    };

    return (
    <>
      <div className='form-wrapper'>
        <h1 style={{textAlign: "center"}}>New Slip Form</h1>
        <form onSubmit={handleSubmit} className="new-item-form">
          <div className="form-row">
            <label htmlFor="slipName">Slip Name</label>
            <input value={slipName} onChange={e => setSlipName(e.target.value)} type="text" id="slipName"/>
            {errors.slipName && <p className='error-text'>{errors.slipName}</p>}
          </div>
          <div className="form-row inline">
            <div className='col-md-6'>
              <label htmlFor="xCoordinate">X Coordinate</label>
              <input value={slipX} onChange={e => setSlipX(e.target.value)} type="number" id="xCoordinate"/>
              </div>
              <div className='col-md-6'>
              <label htmlFor="yCoordinate">Y Coordinate</label>
              <input value={slipY} onChange={e => setSlipY(e.target.value)} type="number" id="yCoordinate"/>
              </div>
          </div>
          <div className='form-row inline'>
          {errors.slipX && <p className='error-text'>{errors.slipX}</p>}
          {errors.slipY && <p className='error-text'>{errors.slipY}</p>}
          </div>
          <div className='form-row'>
            <select className="season-select" value={slipSeason} onChange={e => setSlipSeason(e.target.value)} id="season">
              <option value="">Select Season</option>
              <option value="1">Summer</option>
              <option value="2">Winter</option>
              <option value="3">Year-Round</option>
            </select>
          </div>
          {errors.slipSeason && <p className='error-text'>{errors.slipSeason}</p>}
          <button className="btn">Add Slip</button>
        </form>
        </div>

        <div>
          <button onClick={listSlips} className='btn btn-danger'>List Slips</button>
        </div>
    </>)
}