import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@mui/material'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import Header from '../components/misc/Header'
import { useNavigate } from 'react-router-dom'

const ChatPage = () => {
  const {user} = ChatState()
  const [fetchAgain,setFetchAgain] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if(!userInfo){
            navigate("/")
        }
    },[navigate])
  return (
  <div className='w-full bg-black'>
  
    {user && <Header/>}
    <Box
      justifyContent="space-between"
      width="100%"
      p="10px"
      height="91.5vh"
      gap="30px"
      className="flex flex-col md:flex-row"
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage