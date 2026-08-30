import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import AIChatDrawer from "../components/layouts/AIChatDrawer";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.mainContent}>
        <Outlet context={{ openAIChat: () => setAiChatOpen(true) }} />
      </main>

      <Footer />

      {/* Floating Bottom-Right AI Chat Button */}
      <button
        type="button"
        className={styles.floatingAIChatBtn}
        onClick={() => setAiChatOpen(true)}
        aria-label="Open Archive AI Chat"
      >
        <Sparkles size={14} />
        <span>AI CHAT</span>
      </button>

      {/* AI Assistant Drawer */}
      <AIChatDrawer isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
};

export default MainLayout;