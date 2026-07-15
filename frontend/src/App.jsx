import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Preparing from "./pages/Preparing";
import Message from "./pages/Message";
import Navbar from "./components/layouts/Navbar";
import Sending from "./pages/Sending";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/message" element={<Message />} />
        <Route path="/sending" element={<Sending />} />
        <Route path="*" element={<Preparing />} />
      </Routes>
    </BrowserRouter>
  );
}
