import { Avatar, Box, Modal, Typography } from '@mui/material';
import React from 'react'

const ProfileModal = ({ open, handleClose , user}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96"
      >
        <Typography variant="h6" className="mb-4 font-semibold">
          User Profile
        </Typography>
        <div className="flex flex-col items-center gap-4">
            <Avatar
                src={user?.pic || undefined}
                alt={user?.name}
                className="cursor-pointer"  
            >
            {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : null}
            </Avatar>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
                {user.email}
            </Typography>
        </div>
      </Box>
    </Modal>
  );
};

export default ProfileModal