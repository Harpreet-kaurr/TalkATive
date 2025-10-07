import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle file input
  const handleFileChange = (e) => {
    setLoading(true)
    if(e.target.files[0] === undefined){
        return setToast({
            open: true,
            message: "Please upload image",
            severity: "warning",
        });
    }

    if(e.target.files[0].type==="image/jpeg"|| e.target.files[0].type==="image/png" ){
        const data = new FormData();
        data.append("file",e.target.files[0])
        data.append("upload_preset","chat-app")
        data.append("cloud_name","dypv8ruxf")

        fetch("https://api.cloudinary.com/v1_1/dypv8ruxf/image/upload",{
            method:'post',
            body:data,

        }).then((res)=>res.json())
        .then((result)=>{
            console.log(result)
            setFormData((prev) => ({
                ...prev,
                pic: result.url.toString(),
            }));
            setLoading(false)
        })
        .catch((e)=>{
            console.error("error while uploading picture ",e);
            setLoading(false) 
        })
    }else{
        setLoading(false)
        setToast({
            open: true,
            message: "Please upload image",
            severity: "error",
        });
    }

  };

  // close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // handle form submit
  const handleSubmit = async () => {
    // ✅ check empty fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setToast({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
    }

    // ✅ check password match
    if (formData.password !== formData.confirmPassword) {
      return setToast({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
    }

    try {
      setLoading(true);
        const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        pic: formData.pic, // Cloudinary URL
        };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/user", payload, config);

      setToast({
        open: true,
        message: "User registered successfully!",
        severity: "success",
      });

      console.log("Signup success:", res.data);

      // optional: reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        pic: null,
      });
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Signup failed",
        severity: "error",
      });
      console.error("Signup error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography>Name *</Typography>
      <TextField
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Enter Your Name"
      />

      <Typography>Email Address *</Typography>
      <TextField
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Enter Your Email Address"
      />

      <Typography>Password *</Typography>
      <TextField
        name="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Enter Password"
        type="password"
      />

      <Typography>Confirm Password *</Typography>
      <TextField
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Confirm Password"
        type="password"
      />

      <Typography>Upload your Picture</Typography>
      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{ mt: 1 }}
      >
        Choose File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3, bgcolor: "primary.main" }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
      </Button>

      {/* Snackbar for toast */}
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

export default Signup;
