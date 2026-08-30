import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Quotes from "./pages/Quotes";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Acknowledgement from "./pages/Acknowledgement";
import Resources from "./pages/Resources";
import Preparing from "./pages/Preparing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SafetyHub from "./pages/SafetyHub";
import SafetyScenarioFlow from "./pages/SafetyScenarioFlow";
import Admin from "./pages/Admin";

import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/layouts/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Master Admin Console */}
        <Route path="/only-manik" element={<Admin />} />

        {/* Main Website */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/safety-hub" element={<SafetyHub />} />
          <Route path="/safety-hub/scenario/:id" element={<SafetyScenarioFlow />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/acknowledgement" element={<Acknowledgement />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 / Fallback */}
          <Route path="*" element={<Preparing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}