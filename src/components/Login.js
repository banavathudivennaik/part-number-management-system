
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import D from "./assets/D.jpg";
import myImage from '../assets/D2.jpg'; 

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", {
        username,
        password,
      });

      console.log("Server Response:", res.data);

      if (res.data.success) {
        const displayUser = `${res.data.name} (${res.data.staff_id})`;

        onLogin(displayUser, res.data.user_type);

        navigate("/");
      } else {
        alert("Invalid Username or Password");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Server Error");
    }
  };


  return (
    
    <div style={container}>
      <div style={wrapper}>
 {/* <img src={myImage} alt="Logo" style={{ width: '100px', height: 'auto', marginBottom: '10px' }} /> */}
        {/* Login Box */}

        <div style={loginBox}>

          <h1 style={title}>
            Employee Portal
          </h1>

          <p style={subtitle}>
            Please login to continue
          </p>


          <input
            style={inputStyle}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />


          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter")
                handleLogin();
            }}
          />


          <button 
            style={loginBtn}
            onClick={handleLogin}
          >
            Login
          </button>

        </div>



        {/* Developed By Section */}

        


      </div>
    </div>
  );
}




/* ===========================
        MAIN DESIGN
=========================== */


const container = {
  minHeight: "100vh",
  width: "100vw",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundImage: `
    linear-gradient(rgba(8,25,60,0.72), rgba(8,25,60,0.72)),
    url(${myImage})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",

  padding: "30px",
  fontFamily: "Segoe UI, Arial, sans-serif",
};



const wrapper = {

  width:"100%",

  maxWidth:"470px",

};




const loginBox = {

  background: "rgba(255,255,255,0.96)",

  backdropFilter: "blur(12px)",

  borderRadius: "20px",

  padding: "45px",

  boxShadow:
    "0 25px 60px rgba(0,0,0,0.35)",

  border: "1px solid rgba(255,255,255,0.4)",

  textAlign: "center",

};




const title = {

  color: "#0D47A1",

  fontSize: "38px",

  fontWeight: "700",

  marginBottom: "8px",

};




const subtitle = {

  color: "#555",

  fontSize: "16px",

  marginBottom: "30px",

};





const inputStyle = {

  width: "100%",

  padding: "14px",

  marginBottom: "18px",

  borderRadius: "10px",

  border: "1px solid #D6D6D6",

  fontSize: "15px",

  background: "#F8F9FA",

  outline: "none",

  transition: "0.3s",

  boxSizing: "border-box",

};





const loginBtn = {

  width: "100%",

  padding: "14px",

  border: "none",

  borderRadius: "10px",

  background:
    "linear-gradient(90deg,#1565C0,#2196F3)",

  color: "white",

  fontSize: "17px",

  fontWeight: "bold",

  cursor: "pointer",

  transition: "0.3s",

};





/* ===========================
       DEVELOPED BY TABLE
=========================== */




export default Login;