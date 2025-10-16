import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import './user-register.css'

export function UserRegister() {
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { user_id: "", user_name: "", password: "", email: "" },
    onSubmit: (user) => {
      if (status === "User Id Taken - Try Another") {
        alert("Please choose a different User ID");
        return;
      }
      axios.post(`https://travel-explore-api-data.onrender.com/users`, user)
        .then(() => {
          alert("User Registered Successfully!");
          navigate("/user-login");
        })
        .catch(() => alert("Registration failed. Try again."));
    },
  });

  function checkUserId(e) {
    const userId = e.target.value.trim();
    formik.handleChange(e);
    if (!userId) {
      setStatus("");
      return;
    }
    axios.get(`https://travel-explore-api-data.onrender.com/users`)
      .then(res => {
        const taken = res.data.some(u => u.user_id === userId);
        setStatus(taken ? "User Id Taken - Try Another" : "User Id Available");
        setStatusClass(taken ? "text-danger" : "text-success");
      })
      .catch(() => setStatus("Error checking User ID"));
  }

  return (
    <div className="bg-banner2">
      <div className="bg-color p-5 w-25">
        <h3 style={{ fontStyle: "italic", color: "gold" }}>User Register</h3>
        <form onSubmit={formik.handleSubmit}>
          <dl>
            <dt style={{ color: "red" }}>User Id</dt>
            <dd>
              <TextField
                className="w-100"
                name="user_id"
                label="User Id"
                variant="standard"
                onChange={checkUserId}
                value={formik.values.user_id}
                InputLabelProps={{ style: { color: 'orange' } }}
                sx={{ "& .MuiInputBase-input": { color: "darkblue" } }}
              />
              <small className={statusClass}>{status}</small>
            </dd>
            <dt>User Name</dt>
            <dd><input name="user_name" className="form-control" onChange={formik.handleChange} value={formik.values.user_name} required /></dd>
            <dt>Email</dt>
            <dd><input type="email" name="email" className="form-control" onChange={formik.handleChange} value={formik.values.email} required /></dd>
            <dt>Password</dt>
            <dd><input type="password" name="password" className="form-control" onChange={formik.handleChange} value={formik.values.password} required /></dd>
          </dl>
          <button type="submit" className="btn btn-success bi bi-person-plus-fill">Register</button>
          <Link to="/" className="btn btn-danger mx-2 bi bi-x-circle-fill">Cancel</Link>
          <div className="text-center mt-3">
            <Link to="/admin-login" className="btn btn-link" style={{ color: 'black' }}>
              Admin Login
            </Link>
            <Link to="/user-login" className="btn btn-link" style={{ color: "whitesmoke" }}>
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
