import { useState } from 'react'
import { Login } from './Login';
import "../public/styles.css"
import { NewSlipForm } from './NewSlipForm';
import { Register } from './Register';

function App() {
  const [activeState, setActiveState] = useState("newSlip");

  return (
    <>
      {activeState === 'newSlip' && <NewSlipForm setActiveState={setActiveState} activeState={activeState}/>}
      {activeState === 'login' && <Login setActiveState={setActiveState} activeState={activeState}/>}
      {activeState === 'register' && <Register setActiveState={setActiveState} activeState={activeState}/>}
      <button className='btn' onClick={() => setActiveState('login')}>Login Page</button>
      <button className='btn' onClick={() => setActiveState('register')}>Register Page</button>
      <button className='btn' onClick={() => setActiveState('newSlip')}>New Slip Page</button>
    </>
  )
}

export default App
