import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignInPage from "./page/SignInPage "
import TodoPage from "./page/TodoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignInPage />} />
       <Route path="/todo" element={<TodoPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
