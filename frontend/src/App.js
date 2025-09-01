import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FarmGame from "./components/FarmGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FarmGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;