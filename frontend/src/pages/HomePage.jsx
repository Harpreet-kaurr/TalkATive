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
      <section className="flex flex-col items-center min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex justify-center p-3 border w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-1/3 my-6 rounded-md bg-white shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Talk-A-Tive</h1>
        </div>

        {/* Content Container */}
        <div className="p-5 border w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-1/3 mt-2 rounded-md bg-white shadow-md">
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Login Form */}
          {tab === 0 && <Login />}

          {/* Sign Up Form */}
          {tab === 1 && <Signup />}
        </div>
      </section>
    </>
  )
}

export default HomePage