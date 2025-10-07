import { Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useNavigate } from 'react-router-dom';
// import AuthForm from './AuthForm'
const HomePage = () => {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate()
    useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if(!userInfo){
          navigate("/chat")
      }
    },[navigate])
    const handleChange = (event, newValue) => {
      setTab(newValue);
    };
  return (
    <>
      <section className='flex flex-col items-center'>
        <div className='flex justify-center p-3 border border-r-2 w-[30%] my-5'>
          <h1 className='text-3xl'>Talk-A-Tive</h1>
        </div>
        <div className='p-4 border border-r-2 w-[30%] mt-1 '>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="fullWidth"
            sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
                  {/* Login Form */}
        {tab === 0 && (
          <Login/>
        )}
      {/* Sign Up Form */}
      {tab === 1 && (
          <Signup/>
      )}
        </div>
      </section>
    </>
  )
}

export default HomePage