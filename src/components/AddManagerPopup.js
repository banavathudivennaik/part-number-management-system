

import React, { useState } from "react";
import axios from "axios";

function AddManagerPopup({ closePopup, currentUserRole, loggedUser }) {

  const [formData, setFormData] = useState({
    name: "",
    staffid: "",
    username: "",
    password: "",
    usertype: currentUserRole === "Admin" ? "Manager" : "Engineer"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {

    const { name, staffid, username, password, usertype } = formData;

    if (!name || !staffid || !username || !password || !usertype) {
      alert("Please fill all fields");
      return;
    }

    try {

      // const res = await axios.post(
      //   "http://localhost:5000/addManager",
      //   formData
      // );
      const addedData = {
  ...formData,
  addedby: loggedUser
};

const res = await axios.post(
  "http://localhost:5000/addManager",
  addedData
);

      if (res.data.success) {
        alert("User Added Successfully");
        closePopup();
      }

    } catch (error) {
      console.log(error);
      alert("Error while adding user");
    }

  };

  return (

    <div style={overlayStyle}>

      <div style={popupStyle}>

        {/* ❌ CROSS BUTTON */}
        <button style={crossBtn} onClick={closePopup}>
          ×
        </button>

        <h2>Add User</h2>

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

        <select
          style={inputStyle}
          name="usertype"
          value={formData.usertype}
          onChange={handleChange}
        >

          {currentUserRole === "Admin" && (
            <>
              <option value="Manager">Manager</option>
              <option value="Engineer">Engineer</option>
            </>
          )}

          {currentUserRole === "Manager" && (
            <option value="Engineer">Engineer</option>
          )}

         

        </select>

        {/* BUTTONS */}
        <div style={btnContainer}>

          <button style={saveBtn} onClick={handleSave}>
            Save
          </button>

          <button style={cancelBtn} onClick={closePopup}>
            Cancel
          </button>

        </div>

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
  flexDirection: "column",
  position: "relative"
};

const inputStyle = {
  width: "250px",
  padding: "10px",
  marginBottom: "15px"
};

/* CROSS BUTTON */
const crossBtn = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "22px",
  border: "none",
  background: "transparent",
  cursor: "pointer"
};

const btnContainer = {
  display: "flex",
  justifyContent: "space-between"
};

const saveBtn = {
  background: "#27ae60",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const cancelBtn = {
  background: "#e74c3c",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default AddManagerPopup;