import  axios  from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material"; 
import './admin-login.css'

export function AdminLogin(){
    let navigate=useNavigate();

    const formik=useFormik({
        initialValues:{
            "admin_id":"",
            "password":""
        },
        onSubmit: (admin)=>{
           axios.get('https://travel-explore-api-data.onrender.com/admins')
            .then(response=>{
                var result=response.data.find(user=> user.admin_id===admin.admin_id);
                if(result){
                    if(admin.password===result.password){
                        window.sessionStorage.setItem('uname',result.admin_id);
                        navigate("/admin-dashboard");
                    }
                    else{
                        alert('invalid Password');
                    }
                }
                else {
                    alert('Invalid Admin Id'); 
                }
            }) 
        .catch(error => {
                console.error("Login API failed:", error);
                alert("Could not connect to the database. Please ensure your JSON server is running.");
    });
}
    })

    return(
        <div className="bg-banner">
        <div className="bg-color p-5 w-25">
            <h3 style={{fontStyle:"italic", color:"violet"}}>Admin Login</h3>
            <form onSubmit={formik.handleSubmit}>
                <dl>
                    <dd>
                                            <TextField
                        className="w-100"
                        onChange={formik.handleChange}
                        value={formik.values.admin_id}  
                        name="admin_id"
                        label="Admin Id"
                        variant="standard"
                        InputLabelProps={{ style: { color: 'gold' } }}
                        sx={{
                              "& .MuiInputBase-input": {
                                color: "greenyellow",  
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
          <Link to="/user-login" className="btn btn-link " style={{ color: 'violet' }}>
          <i className="bi bi-person-bounding-box mx-2 "></i>
              User Login
          </Link>
          </div>
            </form>
        </div>
        </div>
        
    )
}
