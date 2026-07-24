

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProjectDocuments from "./components/ProjectDocuments";

function App() {

  // ✅ STORE USERNAME
  const [user, setUser] = useState(null);

  // ✅ STORE USER TYPE
  const [userType, setUserType] = useState("");

  // ✅ LOGIN FUNCTION
  const handleLogin = (username, type) => {

    setUser(username);

    setUserType(type);

  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {

    setUser(null);

    setUserType("");

  };

  return (

    <Router>

      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            user ? (

              <Dashboard
                onLogout={handleLogout}
                loggedUser={user}
                user_type={userType}
              />

            ) : (

              <Navigate to="/login" />

            )
          }
        />

        {/* PROJECT DOCUMENTS */}
        <Route
          path="/project/:projectName"
          element={
            user ? (

              <ProjectDocuments
                loggedUser={user}
              />

            ) : (

              <Navigate to="/login" />

            )
          }
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </Router>

  );

}

export default App;