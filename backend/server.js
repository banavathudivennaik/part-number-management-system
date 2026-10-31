
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());


/* ================= DATABASE CONNECTION ================= */

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Diven@123",
//   database: "partnumberdb",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* TEST CONNECTION */
db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

/* ================= LOGIN ================= */




//*************** 
app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const sql = `
    SELECT * FROM users1
    WHERE user_name = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, result) => {

    if (err) {
      console.log(err);
      return res.send({ success: false });
    }

    if (result.length > 0) {

      res.send({
        success: true,
        user_name: result[0].user_name,
        user_type: result[0].user_type,  // ✅ IMPORTANT
         name: result[0].name,
  staff_id: result[0].staff_id
      });

    } else {

      res.send({ success: false });

    }

  });

});

/* ================= ADD ENGINEER APIs ================= */
app.post("/addEngineer", (req, res) => {

  const {
    name,
    staffid,
    username,
    password,
    usertype
  } = req.body;

  console.log("Incoming Engineer Data:", req.body);

  const sql = `
    INSERT INTO users1
    (name, staff_id, user_name, password, user_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, staffid, username, password, usertype],
    (err, result) => {

      if (err) {

        console.log("ADD ENGINEER ERROR:", err);

        return res.send({
          success: false,
          error: err.message
        });

      }

      console.log("Engineer Added");

      res.send({
        success: true,
        id: result.insertId
      });

    }
  );

});
/* ================= MANAGER APIs ================= */

/* GET MANAGERS */


app.get("/users1", (req, res) => {
  // Changed "managers" to "users1" below
  db.query("SELECT * FROM users1", (err, result) => {
    if (err) {
      console.log(err);
      return res.send([]);
    }
    res.send(result);
  });
});
/* ADD MANAGER */



app.post("/addManager", (req, res) => {

  const {
  name,
  staffid,
  username,
  password,
  usertype,
  addedby
} = req.body;
  console.log("Incoming Data:", req.body);

  const sql = `
   INSERT INTO users1
(name, staff_id, user_name, password, user_type, addedby)
VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, staffid, username, password, usertype, addedby],
    (err, result) => {

      if (err) {

        console.log("ADD USER ERROR:", err);

        return res.send({
          success: false,
          error: err.message
        });

      }

      console.log("User Added");

      res.send({
        success: true,
        id: result.insertId
      });

    }
  );

});

/* ================= PROJECT APIs ================= */

/* GET PROJECTS */
app.get("/projects", (req, res) => {
  db.query(
    "SELECT * FROM projects ORDER BY id DESC",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send([]);
      }

      res.send(result);
    }
  );
});

/* ADD PROJECT */


app.post("/addProject", (req, res) => {

  console.log("Incoming Project:", req.body);

  const {
    name,
    partNumber,
    projecttype,
    manager,
    takenBy,
  } = req.body;

  const sql = `
    INSERT INTO projects
    (name, manager, takenBy, partNumber, projecttype, createdAt)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      name,
      manager,
      takenBy,
      partNumber,
      projecttype
    ],
    (err, result) => {

      if (err) {

        console.log("PROJECT INSERT ERROR:", err);

        return res.send({
          success: false,
          error: err.message,
        });

      }

      console.log("Project Inserted");

      res.send({
        success: true,
        id: result.insertId,
      });

    }
  );

});
/* DELETE PROJECT */
app.delete("/deleteProject/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM projects WHERE id=?",
    [id],
    (err) => {
      if (err) {
        console.log(err);

        return res.send({
          success: false,
        });
      }

      res.send({
        success: true,
      });
    }
  );
});

/* UPDATE PROJECT */
app.put("/updateProject/:id", (req, res) => {
  const { id } = req.params;

  const {
    name,
    partNumber,
    manager,
    takenBy,
  } = req.body;

  const sql = `
    UPDATE projects
    SET
      name=?,
      partNumber=?,
      manager=?,
      takenBy=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, partNumber, manager, takenBy, id],
    (err) => {
      if (err) {
        console.log("UPDATE ERROR:", err);

        return res.send({
          success: false,
          error: err.message,
        });
      }

      console.log("Project Updated");

      res.send({
        success: true,
      });
    }
  );
});

/* ================= DOCUMENT APIs ================= */

/* GET DOCUMENTS */
app.get("/documents/:projectName", (req, res) => {
  const { projectName } = req.params;

  db.query(
    "SELECT * FROM documents WHERE projectName=?",
    [projectName],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send([]);
      }

      res.send(result);
    }
  );
});

/* ADD DOCUMENT */

app.post("/addDocument", (req, res) => {

  // =========================
  // CHANGED: Added custom_part_number
  // =========================
  const {
    project_name,
    document_name,
    project_manager,
    taken_by,
    part_number_type,
    custom_part_number
  } = req.body;

  const type = String(part_number_type || "").toLowerCase();

  const projectSql = `
    SELECT id
    FROM projects
    WHERE name=?
  `;

  db.query(projectSql, [project_name], (err, projectResult) => {

    if (err || projectResult.length === 0) {
      return res.send({ success: false });
    }

    const projectSequence =
      String(projectResult[0].id).padStart(3, "0");

    const insertDocument = (partNumber) => {

      const sql = `
        INSERT INTO documents
        (
          projectName,
          documentName,
          partNumber,
          partNumberType,
          manager,
          takenBy,
          date
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      db.query(
        sql,
        [
          project_name,
          document_name,
          partNumber,
          part_number_type.toUpperCase(),
          project_manager,
          taken_by
        ],
        (err, result) => {

          if (err) {
            return res.send({ success: false });
          }

          return res.send({
            success: true,
            id: result.insertId,
            partNumber
          });

        }
      );
    };

    // ==================================================
    // NEW CODE
    // If React sends custom part number,
    // save it directly and stop.
    // ==================================================
    if(type === "custom"){

      console.log("CUSTOM PART NUMBER:", custom_part_number);

      insertDocument(custom_part_number);

      return;

    }

    // =========================
    // SAME → REPEAT LAST
    // =========================
    if (type === "same") {

      const sql = `
      
        SELECT partNumber
FROM documents
WHERE projectName=?
ORDER BY id DESC
LIMIT 1
      `;

      db.query(sql, [project_name], (err, result) => {

        if (err || result.length === 0) {
          return res.send({ success: false });
        }

        const lastPart = result[0].partNumber;

        console.log("🔁 SAME REPEAT:", lastPart);

        insertDocument(lastPart);

      });

    }

    // =========================
    // NEW → Generate new number
    // =========================
    else {

      const sql = `
        
        SELECT partNumber
FROM documents
WHERE projectName=?
AND partNumberType='NEW'
ORDER BY id DESC
LIMIT 1
      `;

      db.query(sql, [project_name], (err, result) => {

        if (err) {
          console.log("SQL ERROR:",err);
          return res.send({ success: false });
        }

        let baseSeq = "001";
        let revision = 99;


if (result.length > 0) {

    const last = result[0].partNumber.trim();

    // Split using spaces
    const parts = last.split(/\s+/);

    console.log("Last Part Number:", last);
    console.log("Parts:", parts);

    if (parts.length === 4) {
        baseSeq = parts[2];
        revision = parseInt(parts[3], 10);
    }
}

        const newRevision = revision - 3;

        const formatted =
          `9208 ${projectSequence} ${baseSeq} ${newRevision}`;

        console.log("🆕 NEW GENERATED:", formatted);

        insertDocument(formatted);

      });

    }

  });

});
// this is END222222222222222222222222222222
/* DELETE DOCUMENT */
app.delete("/deleteDocument/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM documents WHERE id=?",
    [id],
    (err) => {
      if (err) {
        console.log(err);

        return res.send({
          success: false,
        });
      }

      res.send({
        success: true,
      });
    }
  );
});

/* UPDATE DOCUMENT */
app.put("/updateDocument/:id", (req, res) => {
  const { id } = req.params;

  const { manager, takenBy } = req.body;

  db.query(
    `
      UPDATE documents
      SET manager=?, takenBy=?
      WHERE id=?
    `,
    [manager, takenBy, id],
    (err) => {
      if (err) {
        console.log(err);

        return res.send({
          success: false,
        });
      }

      res.send({
        success: true,
      });
    }
  );
});

app.post("/generatePartNumber", (req, res) => {

  const { project_name } = req.body;

  const projectSql = `
    SELECT id
    FROM projects
    WHERE name=?
  `;

  db.query(projectSql, [project_name], (err, projectResult) => {

    if (err || projectResult.length === 0) {
      return res.send({ success: false });
    }

    const projectSequence =
      String(projectResult[0].id).padStart(3, "0");

    const sql = `
SELECT partNumber
FROM documents
WHERE projectName=?
AND partNumberType='NEW'
ORDER BY id DESC
LIMIT 1
    `;

    db.query(sql, [project_name], (err, result) => {

      let baseSeq = "001";
      let revision = 99;

      
if (result.length > 0) {

  const last = result[0].partNumber.trim();

  console.log("Last Part Number:", last);

  // Split by spaces
  const parts = last.split(/\s+/);

  console.log("Parts:", parts);

  // Check whether the format is valid
  if (parts.length === 4 && !isNaN(parseInt(parts[3], 10))) {

    baseSeq = parts[2];
    revision = parseInt(parts[3], 10);

  } else {

    console.log("Invalid Part Number found in database:", last);

    baseSeq = "001";
    revision = 99;
  }
}
      const newRevision = revision - 3;

      const generated =
        `9208 ${projectSequence} ${baseSeq} ${newRevision}`;

      res.send({
        success: true,
        partNumber: generated
      });

    });

  });

});
// Serve the React production build
app.use(express.static(path.join(__dirname, "../build")));

// Serve the React app at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
/* ================= START SERVER ================= */

// app.listen(5000, () => {
//   console.log("🚀 Server running on port 5000");
// });

// for.env file purpose 
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

