import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Preparing from "./pages/Preparing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="*" element={<Preparing />} />
      </Routes>
    </BrowserRouter>
  );
}
