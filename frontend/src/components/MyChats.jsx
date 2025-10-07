import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Typography,
  CircularProgress,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { getSender } from "../config/ChatLogics";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Group Modal States
  const [openModal, setOpenModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setToast({
        open: true,
        message: "Failed to Load Chats",
        severity: "error",
      });
      return;
    }
  };

  useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  setLoggedUser(userInfo);
  if (userInfo) fetchChats();
}, [user, fetchAgain]);


  // 🔹 Debounced search for users in dropdown
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserOptions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(
          `/api/user?search=${encodeURIComponent(searchQuery)}`,
          config
        );
        setUserOptions(data);
      } catch (err) {
        setToast({
          open: true,
          message: "Failed to load users",
          severity: "error",
        });
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, user]);

  // 🔹 Handle group creation
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      setToast({
        open: true,
        message: "Please provide group name and select users",
        severity: "error",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      };

      const { data } = await axios.post("/api/chat/group", payload, config);

      setChats([data, ...chats]);
      setSelectedChat(data);
      setOpenModal(false);
      setGroupName("");
      setSelectedUsers([]);
      setToast({
        open: true,
        message: "Group created successfully",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to create group",
        severity: "error",
      });
    }
  };

  return (
    <div className="w-full md:w-[30%] p-4 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-sm lg:text-base font-semibold text-gray-800">
          My Chats
        </h2>
        <Button
          variant="contained"
          color="primary"
          className="!rounded-full !normal-case"
          onClick={() => setOpenModal(true)}
        >
            {/* Visible only on large screens and above */}
            <span className="hidden lg:inline">New Group Chat</span>

            {/* Visible only on medium and smaller screens */}
            <span className="inline lg:hidden">New Group</span>
        </Button>
      </div>

      {/* Chat list */}
      <div className="space-y-2">
        {chats.map((chat, index) => (
          <Card
            key={index}
            onClick={() => setSelectedChat(chat)}
            className={`rounded-lg shadow-sm cursor-pointer hover:shadow-md transition ${
              selectedChat === chat
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            <CardContent className="py-2 px-3">
              {/* <p className="font-medium text-sm">
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </p> */}

            <p className="font-medium text-sm">
            {!chat.isGroupChat && loggedUser && chat.users?.length >= 2
              ? getSender(loggedUser, chat.users)
              : chat.chatName}
          </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Chat Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          Create Group Chat
          <IconButton onClick={() => setOpenModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div className="flex flex-col gap-4">
            {/* Group Name */}
            <TextField
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Multi-select User Search */}
            <Autocomplete
              multiple
              options={userOptions}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              value={selectedUsers}
              onChange={(event, newValue) => setSelectedUsers(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onInputChange={(event, value) => setSearchQuery(value)}
              loading={searchLoading}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option._id}
                    size="small"
                  />
                ))
              }
              renderOption={(props, option) => (
                <li {...props} key={option._id} className="flex items-center gap-2">
                  <Avatar src={option.pic} className="w-6 h-6" />
                  <div>
                    <Typography variant="body2" className="font-medium">
                      {option.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {option.email}
                    </Typography>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Users"
                  placeholder="Type to search..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button className="cursor-pointer" variant="contained" onClick={handleCreateGroup}>
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MyChats;
