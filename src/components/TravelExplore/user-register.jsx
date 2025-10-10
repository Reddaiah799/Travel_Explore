import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import './user-register.css'

export function UserRegister() {
  const [status, setStatus] = useState("");
  const [errorClass, setErrorClass] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      user_id: "",
      user_name: "",
      password: "",
      email: ""
    },
    onSubmit: (user) => {
      axios.post(`http://localhost:3000/users`, user).then(() => {
        alert("User Registered Successfully!");
        navigate("/user-login");
      }).catch((error) => {
        console.error("Registration failed:", error);
        alert("Failed to register. Please try again.");
      });
    }
  });

  function VerifyUserId(e) {
    const enteredId = e.target.value;
    formik.handleChange(e); 

    axios.get(`http://localhost:3000/users`)
      .then(response => {
        const userExists = response.data.some(user => user.user_id === enteredId);
        if (userExists) {
          setStatus("User Id Taken - Try Another");
          setErrorClass("text-danger");
        } else {
          setStatus("User Id Available");
          setErrorClass("text-success");
        }
      })
      .catch(error => {
        console.error("Failed to verify user id:", error);
      });
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
                onChange={VerifyUserId}
                value={formik.values.user_id}
                name="user_id"
                label="User Id"
                variant="standard"
                InputLabelProps={{ style: { color: 'orange' } }}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "darkblue",
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#008080',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#004C4C',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#008080',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 128, 128, 1)',
                  },
                }}
              />
              <small className={errorClass}>{status}</small>
            </dd>

            <dt style={{ color: 'Black' }}>User Name</dt>
            <dd>
              <input
                type="text"
                onChange={formik.handleChange}
                name="user_name"
                className="form-control"
                value={formik.values.user_name}
                required
              />
            </dd>

            <dt style={{ color: 'white' }}>Email</dt>
            <dd>
              <input
                type="email"
                onChange={formik.handleChange}
                name="email"
                className="form-control"
                value={formik.values.email}
                required
              />
            </dd>

            <dt style={{ color: 'pink' }}>Password</dt>
            <dd>
              <input
                type="password"
                onChange={formik.handleChange}
                name="password"
                className="form-control"
                value={formik.values.password}
                required
              />
            </dd>
          </dl>

          <button type="submit" className="btn btn-success bi bi-person-plus-fill">
            Register
          </button>

          <Link to="/" className="btn btn-danger mx-2 bi bi-x-circle-fill">
            Cancel
          </Link>

          <div className="text-center mt-3">
            <Link to="/admin-login" className="btn btn-link" style={{ color: 'black' }}>
              <i className="bi bi-person-bounding-box me-2"></i>
              Admin Login
            </Link>

            <Link to="/user-login" className="btn btn-link" style={{ color: "whitesmoke" }}>
             <i className="bi bi-box-arrow-in-right me-2"></i>
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
