// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Test from "./pages/test";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
