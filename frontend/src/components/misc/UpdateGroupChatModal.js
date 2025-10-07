import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const UpdateGroupChatModal = ({
  open,
  handleClose,
  group,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const [chatName, setChatName] = useState(group?.chatName || "");
  const [users, setUsers] = useState(group?.users || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [renameLoading, setRenameLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔍 Manual search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `/api/user?search=${encodeURIComponent(searchQuery)}`,
        config
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add user safely
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      setToast({
        open: true,
        message: "User already in group",
        severity: "error",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setToast({
        open: true,
        message: "Only Admins can add someone!",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setUsers((prev) => [...prev, userToAdd]); // ✅ update local state
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to add user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove user
  const handleRemoveUser = async (user1) => {
    if (!selectedChat || !selectedChat.groupAdmin) {
      setToast({
        open: true,
        message: "No chat selected or group admin not found",
        severity: "error",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      setToast({
        open: true,
        message: "Only Admins can remove someone",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setUsers((prev) => prev.filter((u) => u._id !== user1._id));
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to remove user",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Rename group
  const handleRename = async () => {
    if (!chatName.trim()) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setToast({
        open: true,
        message: error.message,
        severity: "error",
      });
      setChatName("");
    } finally {
      setRenameLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   bg-white rounded-lg shadow-lg p-6 w-[400px]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-semibold">
            {group?.chatName || "Group Chat"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Users */}
        <div className="flex flex-wrap gap-2 mb-4">
          {users.map((u) => (
            <Chip
              key={u._id}
              label={u.name}
              onDelete={() => handleRemoveUser(u)}
              className="!bg-purple-500 !text-white"
              sx={{
                "& .MuiChip-deleteIcon": {
                  color: "white",
                },
                "& .MuiChip-deleteIcon:hover": {
                  color: "#ddd",
                },
              }}
            />
          ))}
        </div>

        {/* Rename Group */}
        <div className="flex gap-2 mb-4">
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            className="px-4"
            onClick={handleRename}
            disabled={renameLoading}
          >
            {renameLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </div>

        {/* Search & Add User */}
        <div className="flex gap-2 mb-4">
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search user to add"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : null}
                </>
              ),
            }}
          />
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button> */}
        </div>

        {/* Search Results */}
        <div className="max-h-40 overflow-y-auto">
          {searchResults.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => handleAddUser(u)}
            >
              <span className="font-medium">{u.name}</span>
              <span className="text-sm text-gray-500">{u.email}</span>
            </div>
          ))}
        </div>

        {/* Leave Group */}
        <Button
          fullWidth
          variant="contained"
          color="error"
          className="mt-4"
          onClick={() => handleRemoveUser(user)}
        >
          Leave Group
        </Button>
      </Box>
    </Modal>
  );
};

export default UpdateGroupChatModal;
