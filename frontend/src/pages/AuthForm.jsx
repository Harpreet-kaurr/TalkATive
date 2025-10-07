import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AuthTabs() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: 400,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 3,
      }}
    >
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>

      {/* Login Form */}
      {tab === 0 && (
        <Box>
          <Typography>Email Address *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter Your Email Address"
          />

          <Typography>Password *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "primary.main" }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "error.main" }}
          >
            Get Guest User Credentials
          </Button>
        </Box>
      )}

      {/* Sign Up Form */}
      {tab === 1 && (
        <Box>
          <Typography>Name *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter Your Name"
          />

          <Typography>Email Address *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter Your Email Address"
          />

          <Typography>Password *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography>Confirm Password *</Typography>
          <TextField
            fullWidth
            margin="normal"
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography>Upload your Picture</Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1 }}
          >
            Choose File
            <input type="file" hidden />
          </Button>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: "primary.main" }}
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Paper>
  );
}
