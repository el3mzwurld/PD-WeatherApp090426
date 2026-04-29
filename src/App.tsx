import { Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";
import "./assets/styles/global.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
