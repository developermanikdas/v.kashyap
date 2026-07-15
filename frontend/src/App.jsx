import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Message from "./pages/Message";
import Sending from "./pages/Sending";
import Preparing from "./pages/Preparing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import QuestionPage from "./components/message/QuestionPage";


import "./App.css";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main Website */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/message" element={<Message />} />
          <Route path="/message/:type" element={<QuestionPage />} />
          <Route path="/sending" element={<Sending />} />
          <Route path="*" element={<Preparing />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}