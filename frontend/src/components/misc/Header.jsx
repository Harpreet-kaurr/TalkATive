import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Notifications, Search } from "@mui/icons-material";
import SideDrawer from "./SideDrawer";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/ChatLogics";

// Profile Popup Component
const ProfileMenu = ({ anchorEl, handleClose, handleOpenModal, logoutHandle }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem
        onClick={() => {
          handleOpenModal();
          handleClose();
        }}
      >
        My Profile
      </MenuItem>
      <Divider/>
      <MenuItem onClick={logoutHandle}>Logout</MenuItem>
    </Menu>
  );
};

// Profile Modal Component


const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate()
  const {user,notification,setSelectedChat,setNotification} = ChatState()
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleOpenNotifications = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
  };
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = () =>{
    localStorage.removeItem("userInfo")
    navigate("/")
  }
  const handleCloseMenu = () => {
    setAnchorEl(null); // ✅ close the menu
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          border: "5px solid #e5e7eb", // light gray border
        }}
      >
        <Toolbar className="flex justify-between">
          {/* Left - Search User */}
          <Tooltip title="Search for users to chat" arrow>
            <div
              className="flex items-center gap-2 rounded-md px-8 py-2 transition-all duration-300 ease-in-out hover:bg-[#eff1f3] cursor-pointer text-gray-700"
              onClick={() => setOpenDrawer(true)}
            >
              <Search />
              <Typography variant="body1" className="font-medium">
                Search User
              </Typography>
            </div>
          </Tooltip>

          {/* Middle - Title */}
          <Typography variant="h6" className="text-gray-700 font-semibold">
            Talk-A-Tive
          </Typography>

          {/* Right - Notifications & Profile */}
          <div className="flex items-center gap-4">
            <IconButton onClick={handleOpenNotifications}>
              <Badge badgeContent={notification.length} color="error">
                <Notifications className="text-gray-700" />
              </Badge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleCloseNotifications}
              PaperProps={{
                className: "rounded-2xl shadow-lg w-72",
              }}
            >
              {/* <Typography className="px-4 py-2 font-semibold text-gray-700">
                Notifications
              </Typography> */}
              {/* <Divider /> */}

              {notification.length === 0 ? (
                <MenuItem disabled className="text-gray-500">
                  No new notifications
                </MenuItem>
              ) : (
                notification.map((n, index) => (
                  <MenuItem key={index} onClick={()=>{
                    setSelectedChat(n.chat)
                    setNotification(notification.filter((ni)=>ni!==n))
                  }}>

                    {n.chat.isGroupChat
                      ?`New Message in ${n.chat.chatName}`
                      :`New Message from ${getSender(user,n.chat.users)}`
                    }
                  </MenuItem>
                ))
              )}
            </Menu>
            <Avatar
              src={user?.pic || undefined}
              alt={user?.name}
              className="cursor-pointer"
              onClick={handleAvatarClick}
            >
              {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : null}
            </Avatar>

          </div>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <ProfileMenu
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        handleOpenModal={handleOpenModal}
        logoutHandle={logout}
      />

      {/* Profile Modal */}
      <ProfileModal open={openModal} handleClose={handleCloseModal} user={user}/>

      {/* Side Drawer */}
      <SideDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </>
  );
};

export default Header;
