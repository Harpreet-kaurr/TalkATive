import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // new state

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      return setToast({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
    }

    try {
      setLoading(true);

      const payload = { email, password };

      const res = await axios.post("/api/user/login", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setToast({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      setEmail("");
      setPassword("");
      navigate("/chat");
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Login failed",
        severity: "error",
      });
      console.error("Login error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setEmail("guest@example.com");
    setPassword("123456");
    setToast({
      open: true,
      message: "Guest credentials filled",
      severity: "info",
    });
  };

  // toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography>Email Address *</Typography>
      <TextField
        fullWidth
        margin="normal"
        placeholder="Enter Your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Typography>Password *</Typography>
      <TextField
        variant="outlined"
        fullWidth
        margin="normal"
        placeholder="Enter Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
            endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            ),
        }}
        />


      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, bgcolor: "primary.main" }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, bgcolor: "error.main" }}
        onClick={handleGuestLogin}
      >
        Get Guest User Credentials
      </Button>

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
    </Box>
  );
};

export default Login;
