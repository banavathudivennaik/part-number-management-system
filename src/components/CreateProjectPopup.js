
import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateProjectPopup({ closePopup, addProject, loggedUser }) {

  const [projectName, setProjectName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [projectType, setProjectType] = useState("");
  const [users1, setusers1] = useState([]);
  const [manager, setManager] = useState("");

  useEffect(() => {

    axios
      .get("/users1")
      .then((res) => {

        setusers1(res.data);

      });

  }, []);

  const handleSubmit = () => {

    if (!projectName || !partNumber || !projectType || !manager) {

      alert("Please fill all fields");
      return;

    }

    const now = new Date();

    const formattedDate =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();

    const newProject = {
      name: projectName,
      partNumber: partNumber,
      projecttype: projectType,
      manager: manager,
      takenBy: loggedUser,
      date: formattedDate
    };

    addProject(newProject);
    closePopup();

  };

  return (

    <div style={overlayStyle}>

      <div style={popupStyle}>

        <div style={headerStyle}>

          <h3>Create Project</h3>

          <span
            style={closeIcon}
            onClick={closePopup}
          >
            ✖
          </span>

        </div>

        {/* PROJECT NAME */}
        <input
          style={inputStyle}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        {/* PROJECT TYPE */}
        <select
          style={inputStyle}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >

          <option value="">
            Select Project Type
          </option>

          <option value="WBS">
            WBS
          </option>

          <option value="Saleorder">
            Saleorder
          </option>

        </select>

        {/* PART NUMBER */}
        <input
          style={inputStyle}
          placeholder="Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
        />

        {/* PROJECT MANAGER */}
        <select
          style={inputStyle}
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        >

          <option value="">
            Select Project Manager
          </option>

          {users1.map((m) => (

            <option
              key={m.id}
              value={m.name}
            >
              {m.name}
            </option>

          ))}

        </select>

        {/* LOGGED USER */}
        <input
          style={inputStyle}
          value={loggedUser}
          readOnly
        />

        {/* BUTTONS */}
        <div style={{ marginTop: "20px" }}>

          <button
            style={saveBtn}
            onClick={handleSubmit}
          >
            Save
          </button>

          <button
            style={backBtn}
            onClick={closePopup}
          >
            Back
          </button>

        </div>

      </div>

    </div>

  );

}

/* ---------- Styles ---------- */

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
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const closeIcon = {
  cursor: "pointer",
  fontSize: "18px",
  color: "#e74c3c"
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  marginBottom: "15px",
  border: "1px solid #dcdcdc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none"
};

const saveBtn = {
  background: "#27ae60",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  marginRight: "10px",
  border: "none",
  cursor: "pointer"
};

const backBtn = {
  background: "#e74c3c",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};

export default CreateProjectPopup;