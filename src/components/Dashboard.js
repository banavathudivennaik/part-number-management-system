
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import CreateProjectPopup from "./CreateProjectPopup";
import AddProjectPopup from "./AddProjectPopup";
import AddManagerPopup from "./AddManagerPopup";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard({ onLogout, loggedUser, user_type }) {

  const [projects, setProjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showManagerPopup, setShowManagerPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  /* ================= PRINT PROJECTS ================= */
const printPDF = () => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Project Dashboard Report", 14, 18);

  // Current Date
  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    26
  );

  // Table
  autoTable(doc, {
    startY: 35,

    head: [[
      "Project Name",
      "Part Number",
      "Project Type",
      "Project Manager",
      "Taken By",
      "Date & Time"
    ]],

    body: projects.map(project => [
      project.name,
      project.partNumber,
      project.projecttype,
      project.manager,
      project.takenBy,
      formatDateTime(project.date)
    ]),

    styles: {
      fontSize: 10
    },

    headStyles: {
      fillColor: [41, 128, 185]
    }
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(11);

  doc.text(
    "Developed By Diven Naik",
    195,
    pageHeight - 10,
    {
      align: "right"
    }
  );

  doc.save("Project_Dashboard.pdf");
};

  /* ================= LOAD PROJECTS ================= */
  const fetchProjects = async () => {

    const res = await axios.get("http://localhost:5000/projects");

    const data = res.data.map(p => ({
      id: p.id,
      name: p.name,
      partNumber: p.partNumber,
      projecttype: p.projecttype,
      manager: p.manager,
      takenBy: p.takenBy,
      date: p.createdAt
    }));

    setProjects(data);

  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= CREATE PROJECT ================= */

  const addProject = async (project) => {

  const newProject = {
  name: project.name,
  partNumber: project.partNumber,
  projecttype: project.projecttype,
  manager: project.manager,
  takenBy: loggedUser
};

    const res = await axios.post(
      "http://localhost:5000/addProject",
      newProject
    );

    if (res.data.success) {
      await fetchProjects();
    } else {
      alert("Failed to save project");
    }

  };

  /* ================= ADD DOCUMENT ================= */

  

  const addDocument = async (docData) => {

  try {

    console.log("📤 FINAL PAYLOAD FROM DASHBOARD:", docData);

    await axios.post("http://localhost:5000/addDocument", {
      project_name: docData.project_name,
      document_name: docData.document_name,
      project_manager: docData.project_manager,
      taken_by: docData.taken_by,
      part_number_type: docData.part_number_type ,  // ✅ ADD THIS
      custom_part_number: docData.custom_part_number
    });

    alert("Document added successfully");

  } catch (error) {

    console.error(error);
    alert("Error adding document");

  }

};

  /* ================= DELETE PROJECT ================= */

  const deleteRow = async (index) => {

    const project = projects[index];

    await axios.delete(
      `http://localhost:5000/deleteProject/${project.id}`
    );

    await fetchProjects();

  };

  /* ================= EDIT PROJECT ================= */

  const startEdit = (index) => {

    setEditIndex(index);
    setEditData(projects[index]);

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEditData({
      ...editData,
      [name]: value
    });

  };

  const saveEdit = async () => {

    try {

      const res = await axios.put(
        `http://localhost:5000/updateProject/${editData.id}`,
        {
          name: editData.name,
          partNumber: editData.partNumber,
          projecttype: editData.projecttype,
          manager: editData.manager,
          takenBy: editData.takenBy
        }
      );

      if (res.data.success) {

        await fetchProjects();
        setEditIndex(null);

        alert("Project Updated Successfully");

      } else {

        alert("Update Failed");

      }

    } catch (error) {

      console.log(error);
      alert("Server Error");

    }

  };

  /* ================= FILTER ================= */

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (dateString) => {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  };

  return (
    

    <div className="dashboard">

  <div className="header">
  <div style={marqueeContainer}>
  <div style={marqueeText}>
    Part Number Management Portal
  </div>
</div>
  {/* <h2 className="title">Project Dashboard</h2> */}

  <div style={{ display: "flex", gap: "10px" }}>

    {/* Print Button */}
    <button
      className="create-btn"
      onClick={printPDF}
    >
      Print
    </button>

    {/* Logout Button */}
    <button
      className="logout-btn"
      onClick={onLogout}
    >
      Logout
    </button>

  </div>

</div>

      <div className="button-container">

        <button
          className="create-btn"
          onClick={() => setShowPopup(true)}
        >
          Create Project
        </button>

        
{user_type !== "Engineer" && (

  <button
    className="add-btn"
    onClick={() => setShowManagerPopup(true)}
  >
    Add User
  </button>

)}
        <button
          className="add-btn"
          onClick={() => setShowAddPopup(true)}
        >
          Add Document
        </button>

      </div>

      <input
        placeholder="Search Project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>

        <thead>
          <tr>
            <th>Project Name</th>
            <th>Part Number</th>
           <th>Project Type</th>   {/* New Column */}
            <th>Project Manager</th>
            <th>Taken By</th>
            <th>Date & Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredProjects.map((project, index) => (

            <tr key={index}>

              {editIndex === index ? (

                <>

                  <td>
                    <input
                      className="edit-input"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      className="edit-input"
                      name="partNumber"
                      value={editData.partNumber}
                      onChange={handleChange}
                    />
                  </td>

                   <td>
                    <input
    className="edit-input"
    name="projecttype"
    value={editData.projecttype}
    onChange={handleChange}
  />
</td>
                  <td>
                    <input
                      className="edit-input"
                      name="manager"
                      value={editData.manager}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      className="edit-input"
                      name="takenBy"
                      value={editData.takenBy}
                      readOnly
                      style={{
                        background: "#f1f1f1",
                        cursor: "not-allowed"
                      }}
                    />
                  </td>

                  <td>{formatDateTime(editData.date)}</td>

                  <td>
                    <button
                      className="save-btn"
                      onClick={saveEdit}
                    >
                      Save
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => setEditIndex(null)}
                    >
                      Cancel
                    </button>
                  </td>

                </>

              ) : (

                <>

                  <td>
                    <Link to={`/project/${encodeURIComponent(project.name)}`}>
                      {project.name}
                    </Link>
                  </td>

                  <td>{project.partNumber}</td>
                  <td>{project.projecttype}</td>
                  <td>{project.manager}</td>
                  <td>{project.takenBy}</td>
                  <td>{formatDateTime(project.date)}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => startEdit(index)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteRow(index)}
                    >
                      Delete
                    </button>

                  </td>

                </>

              )}

            </tr>

          ))}

        </tbody>

      </table>

      {/* ================= POPUPS ================= */}

      {showPopup && (
        <CreateProjectPopup
          closePopup={() => setShowPopup(false)}
          addProject={addProject}
          loggedUser={loggedUser}
        />
      )}

      {showAddPopup && (
        <AddProjectPopup
          projects={projects}
          closePopup={() => setShowAddPopup(false)}
          addDocument={addDocument}
          loggedUser={loggedUser}
        />
      )}

      {showManagerPopup && (
        // <AddManagerPopup
        //   closePopup={() => setShowManagerPopup(false)}
        //   currentUserRole={user_type}
        // />
        <AddManagerPopup
  closePopup={() => setShowManagerPopup(false)}
  currentUserRole={user_type}
  loggedUser={loggedUser}
/>
      )}

    </div>

  );

}

const marqueeContainer = {
  width: "100%",
  background: "white",
  padding: "10px 20px",
  overflow: "hidden",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  borderBottom: "2px solid #2980ff"
};

const marqueeText = {
  display: "inline-block",
  whiteSpace: "nowrap",
  color: "blue",
  fontSize: "22px",
  fontWeight: "bold",
  letterSpacing: "2px",
  animation: "moveText 10s linear infinite"
};

export default Dashboard;