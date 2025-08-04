import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignInPage from "./page/SignInPage "
import TodoPage from "./page/TodoPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignInPage />} />
         <Route path="/todo" element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
