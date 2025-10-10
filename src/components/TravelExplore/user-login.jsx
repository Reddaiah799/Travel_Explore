import  axios  from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material"; 
import './user-login.css'

export function UserLogin(){

    let navigate=useNavigate();
    const formik=useFormik({
        initialValues:{
            "user_id":"",
            "password":""
        },
        onSubmit: (user)=>{
            axios.get('http://localhost:3000/users')
            .then(response=>{
                var result=response.data.find(item=> item.user_id===user.user_id);
                if(result){
                    if(result.password===user.password){
                        window.sessionStorage.setItem('uname',user.user_id);
                        navigate("/user-dashboard");
                    }
                    else{
                        alert('invalid Password');
                    }
                }
                else {
                    alert('Invalid user Id'); 
                }
            }) 
        .catch(error => {
                console.error("Login API failed:", error);
                alert("Could not connect to the database. Please ensure your JSON server is running.");
    });
}
    })

    return(
        <div className="bg-banner1">
        <div className="bg-color p-5 w-25">
            <h3 style={{fontStyle:"italic", color:"gold"}}>User Login</h3>
            <form onSubmit={formik.handleSubmit}>
                <dl>
                    <dd>
                                            <TextField
                        className="w-100"
                        onChange={formik.handleChange}
                        value={formik.values.user_id}  
                        name="user_id"
                        label="User Id"
                        variant="standard"
                        InputLabelProps={{ style: { color: 'orange' } }}
                        sx={{
                              "& .MuiInputBase-input": {
                                color:"darkblue", 
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

                          
                    </dd>
                    <dt style={{color:'red'}}>Password</dt>
                    <dd><input type="password" onChange={formik.handleChange} name="password" className="form-control" value={formik.values.password}  /></dd>
                </dl>
                <button type="submit" className="btn btn-success bi bi-balloon-heart-fill"> Login </button>

                <Link to="/" className="btn btn-danger mx-2 bi bi-heartbreak"> Cancel </Link>
        <div className="text-center mt-3">
          <Link to="/admin-login" className="btn btn-link " style={{ color: 'violet' }}>
          <i className="bi bi-person-bounding-box mx-2 "></i>
              Admin Login
          </Link>
          <Link to="/user-register" className="btn btn-link " style={{ color:"whitesmoke" }}>
         <i class="bi bi-person-add"></i>
              User Register
          </Link>
          </div>
            </form>
        </div>
        </div>
        
    )
}