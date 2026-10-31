import React, { useState } from "react";
import axios from "axios";

function AddEngineerPopup({ closePopup }) {

  const [formData, setFormData] = useState({
    name: "",
    staffid: "",
    username: "",
    password: "",
    usertype: "Engineer"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {

    const {
      name,
      staffid,
      username,
      password,
      usertype
    } = formData;

    if (
      !name ||
      !staffid ||
      !username ||
      !password ||
      !usertype
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post(
        "/addEngineer",
        formData
      );

      if (res.data.success) {

        alert("Engineer Added Successfully");

        closePopup();

      }

    } catch (error) {

      console.log(error);
      alert("Error while adding engineer");

    }

  };

  return (

    <div style={overlayStyle}>

      <div style={popupStyle}>

        <h2>Add Engineer</h2>

        <input
          style={inputStyle}
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="text"
          name="staffid"
          placeholder="Staff ID"
          value={formData.staffid}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          style={saveBtn}
          onClick={handleSave}
        >
          Save
        </button>

      </div>

    </div>

  );
}

/* STYLES */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popupStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column"
  
};

const inputStyle = {
  width: "100%",
  height: "46px",
  padding: "0 14px",
  marginBottom: "15px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  background: "#fff"
};

const saveBtn = {
  background: "#2980b9",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default AddEngineerPopup;