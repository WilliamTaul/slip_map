import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom"

import { Navbar } from '../navbar/Navbar';
import { Login } from '../auth/Login';
import { NewSlipForm } from '../slips/NewSlipForm';
import { Register } from '../auth/Register';
import { Home } from './Home';
import { Message } from '../messages/Message'
import { MessageBoard } from '../messages/MessageBoard';
import { MessageBoards } from '../messages/MessageBoards';
import { EditProfile } from '../profile/EditProfile';
import { AdminMessageBoards } from '../messages/AdminMessageBoards';

import { AuthProvider, useAuth} from '../helpers/AuthContext';
import SocketProvider  from '../helpers/SocketContext';

import "../styles.css";


function App() {

  return (
    <>
      
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Layout></Layout>
           </SocketProvider>
          </AuthProvider>
      </BrowserRouter>
    </>
  )
}

function Layout() {
  const { userRole, isAuthLoading, isLoggedIn } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div>Loading..</div>
  }

  if (userRole === 'onboarding' && location.pathname !== '/edit-profile') {
    return <Navigate to="/edit-profile" replace/>
  }
  if (!isLoggedIn && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  return (
  <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/message-board/:boardId" element={<MessageBoard/>}/>
        <Route path="/message-boards" element={<MessageBoards/>}/>
        <Route path="/admin/message-boards" element={<AdminMessageBoards/>}/>
      </Routes>
  </>
  )
}

export default App
