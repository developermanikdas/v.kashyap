import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Preparing from "./pages/Preparing";
import Login from "./pages/Login";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Main Website */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* Public Routes (now protected by parent layout wrapper) */}

          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<Quotes />} />

          {/* 404 */}

          <Route path="*" element={<Preparing />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}