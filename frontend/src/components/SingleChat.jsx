import { Box, Card, CardContent, TextField } from '@mui/material'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'

const SingleChat = ({fetchAgain,setFetchAgain}) => {
  
    const {user,selectedChat,setSelectedChat} = ChatState()
  return (
    <>
       
            <Card sx={{ borderRadius: 0 }} className="rounded-b-lg shadow-md bg-gray-200 w-full  flex flex-col justify-end ">
                <CardContent className="flex-1 overflow-y-auto">
                {/* Example Message */}
                <div className="flex justify-end">
                    <div className="bg-blue-400 text-white px-3 py-1 rounded-2xl text-sm max-w-xs">
                    hello
                    </div>
                </div>
                </CardContent>

                {/* Input Box */}
                <div className="border-t p-2 bg-white">
                <TextField
                    placeholder="Enter a message.."
                    variant="outlined"
                    fullWidth
                    size="small"
                    className="bg-gray-50 rounded-lg"
                />
                </div>
            </Card>
    </>
  )
}

export default SingleChat