import React, { useState } from "react";
import {
  Drawer,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {ChatState} from '../../Context/ChatProvider'
import axios from "axios";
import ChatLoading from "../ChatLoading";

const SideDrawer = ({ open, onClose }) => {
  const {user,setSelectedChat,chats,setChats} = ChatState()
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };
  const handleSearch = async() => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const config ={
        headers :{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(`/api/user?search=${query}`, config)
      setLoading(false)
      setUsers(data)
    } catch (error) {
      setLoading(false)
      setToast({
        open: true,
        message: "Failed to Load the Search Results",
        severity: "error",
      });
      return
    }
    
  };


 const accessChat = async (userId) => {
    if (user) {
      try {
        setChatLoading(true);

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(`/api/chat`, { userId }, config);

        if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
        }

        setChatLoading(false);
        setSelectedChat(data);
        onClose();
      } catch (error) {
        setChatLoading(false);
        setToast({
          open: true,
          message: error.response?.data?.message || error.message,
          severity: "error",
        });
      }
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className="w-80 p-4 flex flex-col h-full">
        <Typography variant="h6" className="mb-4">
          Search Users
        </Typography>

        {/* Search input */}
        <div className="flex gap-2 mb-4">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>
            Go
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          // <div className="flex justify-center mt-4">
          //   <CircularProgress />
          // </div>
          <ChatLoading/>
        )}

        {/* User results */}
        <div className="flex flex-col gap-3">
          {!loading && users.length > 0 && users.map((user, index) => (
            <Card key={index} onClick={()=>accessChat(user._id)} className="shadow-sm hover:shadow-md cursor-pointer">
              
              <CardContent className="flex items-center gap-3">
                <Avatar src={user.pic} alt={user.name} />
                <div>
                  <Typography variant="subtitle1" className="font-semibold">
                    {user.name}
                  </Typography>
                  <Typography variant="body2">
                    <span className="font-medium">Email:</span> {user.email}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && users.length === 0 && (
            <Typography variant="body2" className="text-gray-500 text-center">
              No users found
            </Typography>
          )}
            <div className="flex mt-0">

          {chatLoading && <CircularProgress />}
          </div>
        </div>
      </div>

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
    </Drawer>
  );
};

export default SideDrawer;
