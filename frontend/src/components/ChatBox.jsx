import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputBase,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import axios from "axios";
import io from 'socket.io-client'
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { useRef } from "react";

const ENDPOINT = "https://talkative-g0ba.onrender.com/" || "http://localhost:5000";

var socket,selectedChatCompare

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const typingTimeoutRef = useRef(null); // persistent timer

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [socketConnected,setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };
  
  const handleUpdateModal = () => setOpenUpdateModal((prev) => !prev);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit('setup',user)
    socket.on('connected',()=>{
      setSocketConnected(true)
    })
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    // to fetch all chat of a user
  const fetchMessages = async () => {
    if(!selectedChat) return

    try {
       const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setLoading(true)
        const {data} = await axios.get(`api/message/${selectedChat._id}`,config)
        setMessages(data)
        setLoading(false)
        socket.emit('join chat',selectedChat._id)
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to get messages",
        severity: "error",
      });
    }
  }
  useEffect(()=>{
    fetchMessages()
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedChat])

  useEffect(()=>{
    socket.on('message recieved', (newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification])
          setFetchAgain(!fetchAgain)
        }
      }else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })



  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      if (newMessage.trim()) {
        socket.emit('stop typing',selectedChat._id)
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };

          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );

          socket.emit('new message',data)
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          setToast({
            open: true,
            message: error.response?.data?.message || "Failed to send message",
            severity: "error",
          });
        }
      } else {
        setToast({
          open: true,
          message: "Cannot send empty message",
          severity: "warning",
        });
      }
    }
  };



const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }

  // Clear previous timer
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  // Set a new timer
  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  }, 3000);
};


  return (
    <>
      {selectedChat ? (
        <Box className="flex flex-col w-full overflow-y-hidden h-full bg-white p-5">
          {/* Chat Header */}
          <Typography
            variant="h6"
            padding="10px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="cursor-pointer border-b pb-3"
            onClick={
              !selectedChat.isGroupChat ? handleOpenModal : handleUpdateModal
            }
          >
            {/* <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon />
            </IconButton> */}
            {!selectedChat.isGroupChat ? (
              getSender(user, selectedChat.users)
            ) : (
              selectedChat.chatName.toUpperCase()
            )}
          </Typography>

          {/* Chat Messages */}
          <Box
            className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-4 flex flex-col-reverse 
            scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500"
          >

            {loading ? (
              <Box className="flex justify-center items-center h-full">
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Box className="flex flex-col gap-2">
                {messages.map((msg,i) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender._id === user._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    {(isSameSender(messages,msg,i,user._id) ||
                      (isLastMessage(messages,i,user._id))) &&
                      (
                        <Tooltip title={msg.sender.name} placement="bottom-start" arrow>
                          <Avatar
                            style={{
                              marginTop:"7px",
                              marginRight:"0px",
                              cursor:"pointer"
                            }}
                            src={msg?.sender?.pic || undefined}
                            alt={msg?.sender?.name}
                          />
                        </Tooltip>
                      )
                    }
                    <Box
                      style={{
                        marginLeft:isSameSenderMargin(messages,msg,i,user._id),
                        marginTop:isSameUser(messages,msg,i,user._id)
                      }}
                      className={`px-4 py-2 rounded-2xl max-w-xs text-white ${
                        msg.sender._id === user._id
                          ? "bg-green-400 rounded-bl-none"
                          : "bg-blue-400 rounded-br-none"
                      }`}
                    >
                      {msg.content}
                    </Box>
                  </div>
                ))}
                {isTyping && (
                  <Lottie
                    options={defaultOptions}
                    height={40}
                    width={120}
                    style={{ width: 120, marginBottom: 15, marginLeft: 0 }}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Input Box */}
          <Paper
            component="form"
            className="flex items-center mt-3 p-2 rounded-xl shadow-md"
          >
            <FormControl className="flex-1">


              <InputBase
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                className="px-3"
              />
            </FormControl>
          </Paper>
        </Box>
      ) : (
        <Box className="flex justify-center items-center w-full h-full bg-white">
          <h2 className="text-2xl font-semibold">
            Click on a user to start chatting
          </h2>
        </Box>
      )}

      {/* Profile Modal */}
      {openModal && (
        <ProfileModal
          open={openModal}
          handleClose={handleCloseModal}
          user={
            !selectedChat.isGroupChat
              ? getSenderFull(user, selectedChat.users)
              : null
          }
        />
      )}

      {/* Update Group Modal */}
      {openUpdateModal && (
        <UpdateGroupChatModal
          open={openUpdateModal}
          handleClose={handleUpdateModal}
          group={selectedChat}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          fetchMessages={fetchMessages}
        />
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatBox;
