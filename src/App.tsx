import { Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";
import "./assets/styles/global.css";
import { Analytics } from "@vercel/analytics/react";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
