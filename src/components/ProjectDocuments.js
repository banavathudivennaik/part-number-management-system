import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ProjectDocuments() {

  const { projectName } = useParams();

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  /* ================= PRINT DOCUMENTS ================= */
const handlePrint = () => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text(`${projectName} Documents Report`, 14, 18);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

  // Table
  autoTable(doc, {
    startY: 35,

    head: [[
      "Document ID",
      "Part Number",
      "Document Name",
      "Project Manager",
      "Taken By",
      "Date"
    ]],

    body: documents.map((docItem, index) => [
      index + 1,
      docItem.partNumber,
      docItem.documentName,
      docItem.manager,
      docItem.takenBy,
      formatDateTime(docItem.date)
    ]),

    styles: {
      fontSize: 9
    },

    headStyles: {
      fillColor: [52, 73, 94]
    }
  });

  // Footer (bottom right)
  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(10);
  doc.text(
    "Developed By Diven Naik",
    195,
    pageHeight - 10,
    { align: "right" }
  );

  doc.save(`${projectName}_documents.pdf`);
};
  /* ================= FETCH DOCUMENTS ================= */

  useEffect(() => {

    axios
      .get(
       `${process.env.REACT_APP_API_URL}/documents/${decodeURIComponent(projectName)}`
      )
      .then(res => {

        setDocuments(res.data);

      })
      .catch(err => {

        console.log(err);

      });

  }, [projectName]);

  /* ================= FORMAT DATE ================= */

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
/* ================= DELETE DOCUMENT ================= */

const deleteDocument = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this document?"
  );

  if (!confirmDelete) return;

  try {

    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/deleteDocument/${id}`
    );

    if (res.data.success) {

      alert("Document deleted successfully.");

      setDocuments(
        documents.filter((doc) => doc.id !== id)
      );

    } else {

      alert("Delete failed.");

    }

  } catch (err) {

    console.log(err);

    alert("Error deleting document.");

  }

};
  return (

    
    <div style={containerStyle}>

      {/* HEADER */}
 <div style={marqueeContainer}>
  <div style={marqueeText}>
    Part Number Management Portal
  </div>
</div>

      <div style={headerStyle}>

  <h2>{projectName} Documents</h2>

  <div style={{ display: "flex", gap: "10px" }}>

    {/* PRINT BUTTON */}
    <button
      onClick={handlePrint}
      style={{
        background: "#2ecc71",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Print
    </button>

    {/* BACK BUTTON */}
    <button
      style={backBtn}
      onClick={() => navigate(-1)}
    >
      Back
    </button>

  </div>

</div>

      {/* TABLE */}

      <table style={tableStyle}>

        <thead>

          <tr style={theadStyle}>

            <th style={thStyle}>Document ID</th>
            <th style={thStyle}>Part Number</th>
            {/* <th style={thStyle}>Project Type</th> */}
            <th style={thStyle}>Document Name</th>
            <th style={thStyle}>Project Manager</th>
            <th style={thStyle}>Taken By</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>

        </thead>

        <tbody>

          {documents.length > 0 ? (

            documents.map((doc, index) => (

              <tr
                key={index}
                style={{
                  background:
                    index % 2 === 0
                      ? "#f9f9f9"
                      : "#ffffff"
                }}
              >

                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{doc.partNumber}</td>
                {/* <td style={tdStyle}>{doc.projecttype}</td> */}
                <td style={tdStyle}>{doc.documentName}</td>
                <td style={tdStyle}>{doc.manager}</td>
                <td style={tdStyle}>{doc.takenBy}</td>

                <td style={tdStyle}>
                  {formatDateTime(doc.date)}
                </td>
                <td style={tdStyle}>
  <button
    style={deleteBtn}
    onClick={() => deleteDocument(doc.id)}
  >
    Delete
  </button>
</td>


              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "20px"
                }}
              >
                No Documents Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );
}

/* ================= STYLES ================= */

const containerStyle = {
  padding: "30px",
  minHeight: "100vh",
  background:
    "linear-gradient(to right, #7ed6df, #74b9ff)"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const backBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const theadStyle = {
  background: "#34495e",
  color: "white"
};

const thStyle = {
  padding: "15px"
};

const tdStyle = {
  padding: "15px",
  textAlign: "center"
};

const marqueeContainer = {
  width: "100%",
  background: "white",
  padding: "10px 0",
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
const deleteBtn = {

  background: "#e74c3c",

  color: "white",

  border: "none",

  padding: "8px 16px",

  borderRadius: "5px",

  cursor: "pointer",

  fontWeight: "bold"

};
export default ProjectDocuments;


