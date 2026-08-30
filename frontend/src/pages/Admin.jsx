import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Shield,
  Heart,
  MessageSquare,
  Bot,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Play,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  History,
  Clock,
  User,
  ShieldAlert,
} from "lucide-react";
import Modal from "../components/common/Modal/Modal";
import Button from "../components/common/Button/Button";
import Toast from "../components/common/Toast/Toast";
import AdminSandbotDrawer from "../components/admin/AdminSandbotDrawer";
import { formatRelativeTime } from "../utils/timeUtils";
import { API_BASE } from "../config/api";
import styles from "./Admin.module.css";

const KNOWLEDGE_CATEGORIES = [
  "all",
  "About Her (Vanshika)",
  "About Him (Manik)",
  "Shared Memories & Moments",
  "Creative Passions",
  "Safety & Boundaries",
  "Mindfulness & Reflection",
  "General",
];

const Admin = () => {
  const navigate = useNavigate();

  // Authentication State with signed JWT token
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem("archive_admin_token") || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("archive_admin_token"));
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Sandbot AI Copilot Drawer State
  const [isSandbotOpen, setIsSandbotOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("stories");

  // Data Collections State
  const [stories, setStories] = useState([]);
  const [safetyScenarios, setSafetyScenarios] = useState([]);
  const [acknowledgements, setAcknowledgements] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [botMemories, setBotMemories] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bot Memory Filtering & Search State
  const [memoryCategoryFilter, setMemoryCategoryFilter] = useState("all");
  const [memorySearchTerm, setMemorySearchTerm] = useState("");

  // RAG Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simQuery, setSimQuery] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Modal State
  const [modalType, setModalType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // User Chat Audit State
  const [userChatLogs, setUserChatLogs] = useState([]);
  const [chatAuditStats, setChatAuditStats] = useState({ totalSessions: 0, clientCleared: 0 });
  const [selectedChatSession, setSelectedChatSession] = useState(null);
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [chatStatusFilter, setChatStatusFilter] = useState("all");
  const [loadingChatDetail, setLoadingChatDetail] = useState(false);

  // Helper for Authorization Headers with Bearer Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("archive_admin_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("archive_admin_token");
    setAdminToken("");
    setIsAuthenticated(false);
    setAuthError("Admin session expired or invalid. Please sign in again.");
  };

  // 1. Fetch Data for Active Tab
  const fetchTabData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (activeTab === "stories") {
        const res = await fetch(`${API_BASE}/stories`);
        const json = await res.json();
        if (json.success) setStories(json.data || []);
      } else if (activeTab === "safety") {
        const res = await fetch(`${API_BASE}/safety`);
        const json = await res.json();
        if (json.success) setSafetyScenarios(json.data || []);
      } else if (activeTab === "acknowledgements") {
        const res = await fetch(`${API_BASE}/acknowledgements`);
        const json = await res.json();
        if (json.success) setAcknowledgements(json.data || []);
      } else if (activeTab === "features") {
        const res = await fetch(`${API_BASE}/features/requests`);
        const json = await res.json();
        if (json.success) setFeatureRequests(json.data || []);
      } else if (activeTab === "botMemory") {
        const res = await fetch(`${API_BASE}/admin/bot-memories`, {
          headers: getAuthHeaders(),
        });
        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }
        const json = await res.json();
        if (json.success) setBotMemories(json.data || []);
      } else if (activeTab === "resources") {
        const res = await fetch(`${API_BASE}/resources`);
        const json = await res.json();
        if (json.success) setResources(json.data || []);
      } else if (activeTab === "userChats") {
        let url = `${API_BASE}/admin/user-chats`;
        const params = new URLSearchParams();
        if (chatSearchTerm) params.append("search", chatSearchTerm);
        if (chatStatusFilter !== "all") params.append("status", chatStatusFilter);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }
        const json = await res.json();
        if (json.success) {
          setUserChatLogs(json.data || []);
          if (json.stats) setChatAuditStats(json.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setToastMessage("Failed to fetch data from MongoDB.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [activeTab, isAuthenticated, chatSearchTerm, chatStatusFilter]);

  const handleInspectChatLog = async (sessionId) => {
    setLoadingChatDetail(true);
    try {
      const res = await fetch(`${API_BASE}/admin/user-chats/${sessionId}`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedChatSession(json.data);
      } else {
        setToastMessage("Could not retrieve conversation transcript.");
      }
    } catch (err) {
      console.error("Error loading chat detail:", err);
      setToastMessage("Error loading chat log transcript.");
    } finally {
      setLoadingChatDetail(false);
    }
  };

  const handleDeleteUserChat = async (sessionId, sessionTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the chat log "${sessionTitle || sessionId}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/user-chats/${sessionId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const json = await res.json();
      if (json.success) {
        setUserChatLogs((prev) => prev.filter((l) => l.sessionId !== sessionId));
        setChatAuditStats((prev) => ({
          ...prev,
          totalSessions: Math.max(0, (prev.totalSessions || 1) - 1),
        }));
        if (selectedChatSession?.sessionId === sessionId) {
          setSelectedChatSession(null);
        }
        setToastMessage("User chat conversation permanently deleted from database.");
      } else {
        setToastMessage(json.message || "Failed to delete chat log.");
      }
    } catch (err) {
      console.error("Error deleting chat log:", err);
      setToastMessage("Error deleting chat log from database.");
    }
  };

  const handleClearAllUserChats = async () => {
    if (
      !window.confirm(
        "⚠️ WARNING: This will permanently delete ALL user chat conversation records from MongoDB. This action is irreversible.\n\nDo you wish to proceed?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/user-chats`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const json = await res.json();
      if (json.success) {
        setUserChatLogs([]);
        setChatAuditStats({ totalSessions: 0, clientCleared: 0 });
        setSelectedChatSession(null);
        setToastMessage("All user chat history logs permanently wiped from database.");
      } else {
        setToastMessage(json.message || "Failed to purge chat logs.");
      }
    } catch (err) {
      console.error("Error purging all user chats:", err);
      setToastMessage("Error communicating with server.");
    }
  };

  // Handle Admin Login (Stores signed JWT)
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("archive_admin_token", data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        setToastMessage("Welcome, Master Admin. Authentication verified.");
      } else {
        setAuthError(data.message || "Invalid credentials.");
      }
    } catch {
      setAuthError("Could not connect to authentication server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("archive_admin_token");
    setAdminToken("");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Open Create Modal
  const openCreateModal = (type) => {
    setModalType(type);
    setIsEditing(false);
    setEditingId(null);

    if (type === "story") {
      setFormData({
        id: `story_${Date.now()}`,
        title: "",
        subtitle: "",
        tag: "Restoration Series",
        entryNo: "Archive Entry No. 052",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        paragraphs: "",
        pullQuote: "",
        remainingParagraphs: "",
      });
    } else if (type === "safety") {
      setFormData({
        id: `s0${safetyScenarios.length + 1}`,
        num: `${safetyScenarios.length + 1}`,
        category: "EVERYDAY PUBLIC HARASSMENT",
        categoryId: "harassment",
        riskLevel: "Concerning",
        riskBadge: "CONCERNING",
        title: "",
        summary: "",
        overview: "",
        assessmentCriteria: "",
        prohibitedActions: "",
      });
    } else if (type === "ack") {
      setFormData({
        quote: "",
        author: "",
        meta: "Archive Contributor",
      });
    } else if (type === "botMemory") {
      setFormData({
        topic: "",
        category: "About Her (Vanshika)",
        keywords: "",
        answer: "",
        priority: 4,
        isActive: true,
      });
    } else if (type === "resource") {
      setFormData({
        title: "",
        summary: "",
        description: "",
        category: "Safety & Wellbeing",
        fileUrl: "",
        cloudinaryPublicId: "",
      });
    }
  };

  // Open Edit Modal
  const openEditModal = (type, item) => {
    setModalType(type);
    setIsEditing(true);
    setEditingId(item.id || item._id);

    if (type === "story") {
      setFormData({
        id: item.id,
        title: item.title || "",
        subtitle: item.subtitle || "",
        tag: item.tag || "",
        entryNo: item.entryNo || "",
        date: item.date || "",
        paragraphs: Array.isArray(item.paragraphs) ? item.paragraphs.join("\n\n") : "",
        pullQuote: item.pullQuote || "",
        remainingParagraphs: Array.isArray(item.remainingParagraphs) ? item.remainingParagraphs.join("\n\n") : "",
      });
    } else if (type === "safety") {
      setFormData({
        id: item.id,
        num: item.num || "",
        category: item.category || "",
        categoryId: item.categoryId || "harassment",
        riskLevel: item.riskLevel || "Concerning",
        riskBadge: item.riskBadge || "CONCERNING",
        title: item.title || "",
        summary: item.summary || "",
        overview: item.overview || "",
        assessmentCriteria: Array.isArray(item.assessmentCriteria) ? item.assessmentCriteria.join("\n") : "",
        prohibitedActions: Array.isArray(item.prohibitedActions) ? item.prohibitedActions.join("\n") : "",
      });
    } else if (type === "ack") {
      setFormData({
        id: item.id,
        quote: item.quote || "",
        author: item.author || "",
        meta: item.meta || "",
      });
    } else if (type === "botMemory") {
      setFormData({
        topic: item.topic || "",
        category: item.category || "About Her (Vanshika)",
        keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : "",
        answer: item.answer || "",
        priority: item.priority !== undefined ? item.priority : 1,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    } else if (type === "resource") {
      setFormData({
        id: item.id || item._id,
        title: item.title || "",
        summary: item.summary || item.description || "",
        description: item.description || item.summary || "",
        category: item.category || "Safety & Wellbeing",
        fileUrl: item.fileUrl || "",
        cloudinaryPublicId: item.cloudinaryPublicId || "",
      });
    }
  };

  // Handle Prefill from Sandbot AI Draft
  const handlePrefillFromAi = ({ type, data }) => {
    setIsSandbotOpen(false);
    if (type === "story") {
      setActiveTab("stories");
      setModalType("story");
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        id: data.id || `story-${Date.now()}`,
        title: data.title || "",
        subtitle: data.subtitle || "",
        tag: data.tag || "Restoration Series",
        entryNo: data.entryNo || `Archive Entry No. ${String(stories.length + 1).padStart(3, "0")}`,
        date: data.date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs.join("\n\n") : (data.paragraphs || ""),
        pullQuote: data.pullQuote || "",
        remainingParagraphs: Array.isArray(data.remainingParagraphs) ? data.remainingParagraphs.join("\n\n") : (data.remainingParagraphs || ""),
      });
    } else if (type === "botMemory" || type === "memory") {
      setActiveTab("botMemory");
      setModalType("botMemory");
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        topic: data.topic || "",
        category: data.category || "About Her (Vanshika)",
        keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : (data.keywords || ""),
        answer: data.answer || "",
        priority: Number(data.priority) || 4,
        isActive: true,
      });
    } else if (type === "safety") {
      setActiveTab("safety");
      setModalType("safety");
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        id: data.id || `safety_${Date.now()}`,
        num: data.num || `${safetyScenarios.length + 1}`,
        category: data.category || "EVERYDAY PUBLIC HARASSMENT",
        categoryId: data.categoryId || "harassment",
        riskLevel: data.riskLevel || "Concerning",
        riskBadge: data.riskBadge || "CONCERNING",
        title: data.title || "",
        summary: data.summary || "",
        overview: data.overview || "",
        assessmentCriteria: Array.isArray(data.assessmentCriteria) ? data.assessmentCriteria.join("\n") : (data.assessmentCriteria || ""),
        prohibitedActions: Array.isArray(data.prohibitedActions) ? data.prohibitedActions.join("\n") : (data.prohibitedActions || ""),
      });
    } else if (type === "ack") {
      setActiveTab("acknowledgements");
      setModalType("ack");
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        quote: data.quote || "",
        author: data.author || "",
        meta: data.meta || "Archive Contributor",
      });
    }
    setToastMessage("Form prefilled from Sandbot draft. You can make changes and save.");
  };

  // Submit Form (Create / Update with Bearer Token)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalType === "story") {
        const payload = {
          ...formData,
          paragraphs: formData.paragraphs ? formData.paragraphs.split("\n\n").filter(Boolean) : [],
          remainingParagraphs: formData.remainingParagraphs ? formData.remainingParagraphs.split("\n\n").filter(Boolean) : [],
        };

        const url = isEditing ? `${API_BASE}/admin/stories/${editingId}` : `${API_BASE}/admin/stories`;
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        if (res.ok) {
          setToastMessage(isEditing ? "Story updated successfully." : "New story created in database.");
          setModalType(null);
          fetchTabData();
        }
      } else if (modalType === "safety") {
        const payload = {
          ...formData,
          assessmentCriteria: formData.assessmentCriteria ? formData.assessmentCriteria.split("\n").filter(Boolean) : [],
          prohibitedActions: formData.prohibitedActions ? formData.prohibitedActions.split("\n").filter(Boolean) : [],
        };

        const url = isEditing ? `${API_BASE}/admin/safety/${editingId}` : `${API_BASE}/admin/safety`;
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        if (res.ok) {
          setToastMessage(isEditing ? "Safety scenario updated." : "New safety protocol added.");
          setModalType(null);
          fetchTabData();
        }
      } else if (modalType === "ack") {
        const url = isEditing ? `${API_BASE}/admin/acknowledgements/${editingId}` : `${API_BASE}/acknowledgements`;
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        if (res.ok) {
          setToastMessage(isEditing ? "Acknowledgment updated." : "New ledger entry penned.");
          setModalType(null);
          fetchTabData();
        }
      } else if (modalType === "botMemory") {
        const payload = {
          ...formData,
          priority: Number(formData.priority) || 1,
          keywords: typeof formData.keywords === "string" ? formData.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean) : formData.keywords,
        };

        const url = isEditing ? `${API_BASE}/admin/bot-memories/${editingId}` : `${API_BASE}/admin/bot-memories`;
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        if (res.ok) {
          setToastMessage(isEditing ? "Chatbot memory updated." : "New memory fed to AI Assistant.");
          setModalType(null);
          fetchTabData();
        }
      } else if (modalType === "resource") {
        const fileInput = document.getElementById("adminPdfFileInput");
        const selectedFile = fileInput?.files?.[0];
        const token = localStorage.getItem("archive_admin_token") || "";

        let res;
        if (selectedFile) {
          const uploadData = new FormData();
          uploadData.append("title", formData.title);
          uploadData.append("summary", formData.summary || formData.description || "");
          uploadData.append("description", formData.description || formData.summary || "");
          uploadData.append("category", formData.category || "Safety & Wellbeing");
          uploadData.append("file", selectedFile);

          const url = isEditing ? `${API_BASE}/admin/resources/${editingId}` : `${API_BASE}/admin/resources`;
          const method = isEditing ? "PUT" : "POST";

          res = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: uploadData,
          });
        } else {
          const url = isEditing ? `${API_BASE}/admin/resources/${editingId}` : `${API_BASE}/admin/resources`;
          const method = isEditing ? "PUT" : "POST";

          res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
          });
        }

        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }

        const resData = await res.json();
        if (res.ok && resData.success) {
          setToastMessage(isEditing ? "PDF resource updated successfully." : "PDF uploaded to Cloudinary & saved to database.");
          setModalType(null);
          fetchTabData();
        } else {
          setToastMessage(resData.message || "Failed to save PDF resource.");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setToastMessage("Error saving changes to database.");
    }
  };

  // Run Live RAG Simulator Query
  const handleRunSimulator = async (e, customQuery) => {
    if (e) e.preventDefault();
    const queryToRun = (customQuery || simQuery).trim();
    if (!queryToRun) return;

    setSimLoading(true);
    setSimResult(null);

    try {
      const res = await fetch(`${API_BASE}/admin/bot-memories/test-rag`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query: queryToRun }),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSimResult(data);
      } else {
        setToastMessage(data.message || "Simulator query error.");
      }
    } catch {
      setToastMessage("Failed to connect to RAG simulator endpoint.");
    } finally {
      setSimLoading(false);
    }
  };

  // Delete Entity with Bearer Token
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to permanently delete this item from the database?")) {
      return;
    }

    try {
      let endpoint = "";
      if (type === "story") endpoint = `${API_BASE}/admin/stories/${id}`;
      else if (type === "safety") endpoint = `${API_BASE}/admin/safety/${id}`;
      else if (type === "ack") endpoint = `${API_BASE}/admin/acknowledgements/${id}`;
      else if (type === "feature") endpoint = `${API_BASE}/admin/features/${id}`;
      else if (type === "botMemory") endpoint = `${API_BASE}/admin/bot-memories/${id}`;
      else if (type === "resource") endpoint = `${API_BASE}/admin/resources/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        setToastMessage("Item permanently deleted from database.");
        fetchTabData();
      }
    } catch {
      setToastMessage("Failed to delete item.");
    }
  };

  // Toggle Feature Request Status
  const handleFeatureStatusToggle = async (id, currentStatus) => {
    const nextStatusMap = {
      pending: "reviewed",
      reviewed: "in-progress",
      "in-progress": "completed",
      completed: "pending",
    };

    const nextStatus = nextStatusMap[currentStatus] || "reviewed";

    try {
      const res = await fetch(`${API_BASE}/features/requests/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setToastMessage(`Status updated to ${nextStatus}.`);
        fetchTabData();
      }
    } catch {
      setToastMessage("Error updating feature status.");
    }
  };

  // Toggle Bot Memory Active Status
  const handleToggleMemoryActive = async (mem) => {
    try {
      const res = await fetch(`${API_BASE}/admin/bot-memories/${mem._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !mem.isActive }),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        setToastMessage(`Memory ${!mem.isActive ? "activated" : "deactivated"}.`);
        fetchTabData();
      }
    } catch {
      setToastMessage("Error toggling memory status.");
    }
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.authCard}>
          <span className={styles.authTag}>ADMIN CONSOLE</span>
          <h1 className={styles.authTitle}>Sign In</h1>
          <p className={styles.authSubtitle}>
            Master administrative access protected by cryptographically signed JWT.
          </p>

          <form className={styles.authForm} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label}>USERNAME</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter master username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>PASSWORD</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter master password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {authError && (
              <p style={{ color: "#800020", fontSize: "0.8125rem", margin: "0.25rem 0" }}>
                {authError}
              </p>
            )}

            <button type="submit" className={styles.authSubmitBtn}>
              Unlock Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.topBar}>
        <div className={styles.brandInfo}>
          <span className={styles.adminTag}>MASTER CONTROL PANEL &bull; /only-manik</span>
          <h1 className={styles.mainTitle}>Archive Admin Console</h1>
        </div>

        <div className={styles.topActions}>
          <Link to="/" className={styles.exitBtn}>
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </Link>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className={styles.tabsNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "stories" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("stories")}
        >
          <BookOpen size={15} />
          <span>Stories ({stories.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "safety" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("safety")}
        >
          <Shield size={15} />
          <span>Safety Protocols ({safetyScenarios.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "acknowledgements" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("acknowledgements")}
        >
          <Heart size={15} />
          <span>Acknowledgments ({acknowledgements.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "features" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("features")}
        >
          <MessageSquare size={15} />
          <span>Feature Requests ({featureRequests.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "botMemory" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("botMemory")}
        >
          <Bot size={15} />
          <span>AI Chatbot Memory ({botMemories.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "resources" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          <FileText size={15} />
          <span>PDF Resources ({resources.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "userChats" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("userChats")}
        >
          <History size={15} />
          <span>User Chat Logs ({chatAuditStats?.totalSessions || userChatLogs.length})</span>
        </button>
      </nav>

      {/* 1. STORIES TAB */}
      {activeTab === "stories" && (
        <section>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Archive Stories & Meditative Essays</h2>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => openCreateModal("story")}
            >
              <Plus size={15} />
              <span>Create New Essay</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID / Slug</th>
                  <th>Title</th>
                  <th>Series Tag</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s._id || s.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td>{s.tag}</td>
                    <td>{s.date}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className={styles.actionIconBtn}
                          title="Edit Essay"
                          onClick={() => openEditModal("story", s)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                          title="Delete Essay"
                          onClick={() => handleDelete("story", s.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. SAFETY PROTOCOLS TAB */}
      {activeTab === "safety" && (
        <section>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Situational Awareness Protocols</h2>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => openCreateModal("safety")}
            >
              <Plus size={15} />
              <span>Add Safety Protocol</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Risk Level</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safetyScenarios.map((sc) => (
                  <tr key={sc._id || sc.id}>
                    <td>{sc.num}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{sc.id}</td>
                    <td style={{ fontWeight: 600 }}>{sc.title}</td>
                    <td>{sc.category}</td>
                    <td>
                      <span
                        className={styles.statusPill}
                        style={{
                          borderColor: sc.riskLevel === "Immediate Danger" || sc.riskLevel === "Red" ? "#800020" : "#d1d5db",
                          color: sc.riskLevel === "Immediate Danger" || sc.riskLevel === "Red" ? "#800020" : "inherit",
                        }}
                      >
                        {sc.riskBadge || sc.riskLevel}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className={styles.actionIconBtn}
                          title="Edit Protocol"
                          onClick={() => openEditModal("safety", sc)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                          title="Delete Protocol"
                          onClick={() => handleDelete("safety", sc.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. ACKNOWLEDGMENTS TAB */}
      {activeTab === "acknowledgements" && (
        <section>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Acknowledgments & Gratitude Ledger</h2>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => openCreateModal("ack")}
            >
              <Plus size={15} />
              <span>Pen New Entry</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Quote / Note</th>
                  <th>Author</th>
                  <th>Location / Meta</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {acknowledgements.map((a) => (
                  <tr key={a._id || a.id}>
                    <td>&ldquo;{a.quote}&rdquo;</td>
                    <td style={{ fontWeight: 700 }}>{a.author}</td>
                    <td>{a.meta}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className={styles.actionIconBtn}
                          title="Edit Entry"
                          onClick={() => openEditModal("ack", a)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                          title="Delete Entry"
                          onClick={() => handleDelete("ack", a.id || a._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. FEATURE REQUESTS TAB */}
      {activeTab === "features" && (
        <section>
          <div className={styles.tabHeader}>
            <h2 className={styles.tabTitle}>Community Feature Suggestions</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Suggestion</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {featureRequests.length > 0 ? (
                  featureRequests.map((f) => (
                    <tr key={f._id}>
                      <td>&ldquo;{f.suggestion}&rdquo;</td>
                      <td>{f.user}</td>
                      <td>
                        <button
                          type="button"
                          className={`${styles.statusPill} ${
                            f.status === "completed"
                              ? styles.pillCompleted
                              : f.status === "reviewed" || f.status === "in-progress"
                              ? styles.pillReviewed
                              : styles.pillPending
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleFeatureStatusToggle(f._id, f.status)}
                          title="Click to toggle status"
                        >
                          {f.status} ⟳
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                            title="Delete Request"
                            onClick={() => handleDelete("feature", f._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", fontStyle: "italic", padding: "2rem" }}>
                      No feature requests submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}      {/* 5. AI CHATBOT MEMORY FEED TAB */}
      {activeTab === "botMemory" && (
        <section>
          <div className={styles.tabHeader}>
            <div>
              <h2 className={styles.tabTitle}>AI Assistant Knowledge & Memory Feed (RAG)</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                Manage verified memories, facts, and wisdom fed into Groq / Grok LLM via lightweight RAG.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className={styles.exitBtn}
                onClick={() => setShowSimulator((prev) => !prev)}
                style={{ backgroundColor: showSimulator ? "#ffffff" : "transparent" }}
              >
                <Sparkles size={14} color="#800020" />
                <span>{showSimulator ? "Hide RAG Simulator" : "Test RAG Simulator"}</span>
                {showSimulator ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={() => openCreateModal("botMemory")}
              >
                <Plus size={15} />
                <span>Feed New Memory</span>
              </button>
            </div>
          </div>

          {/* RAG SIMULATOR PANEL */}
          {showSimulator && (
            <div className={styles.simulatorCard}>
              <div className={styles.simulatorHeader}>
                <div className={styles.simulatorTitle}>
                  <Sparkles size={16} color="#800020" />
                  <span>Live RAG Assistant Simulator</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Tests retrieval scoring & Groq / Grok token usage
                </span>
              </div>

              <form onSubmit={(e) => handleRunSimulator(e)} className={styles.simulatorForm}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Ask a question as she or you would (e.g. 'What do you know about Vanshika?', 'Tell me about Manik')..."
                  value={simQuery}
                  onChange={(e) => setSimQuery(e.target.value)}
                  disabled={simLoading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!simQuery.trim() || simLoading}
                >
                  <Play size={13} style={{ marginRight: "0.3rem" }} />
                  {simLoading ? "Querying LLM..." : "Test Prompt"}
                </Button>
              </form>

              {/* Preset Quick Test Questions */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-muted)", alignSelf: "center", marginRight: "0.25rem" }}>
                  TRY PRESETS:
                </span>
                {[
                  "What do you know about Vanshika?",
                  "Tell me about Manik and how he feels about me",
                  "Do you remember the River Ganga call?",
                  "How to do 4-4-6 calming breath?",
                  "How do I set boundaries without guilt?",
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    className={styles.categoryFilterBtn}
                    onClick={() => {
                      setSimQuery(prompt);
                      handleRunSimulator(null, prompt);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {simResult && (
                <div className={styles.simulatorResult}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaTag}>SOURCE: {simResult.source}</span>
                    <span className={styles.metaTag}>MODEL: {simResult.model || "qwen/qwen3.8-27b"}</span>
                    {simResult.tokensUsed ? (
                      <span className={styles.metaTag}>TOKENS USED: {simResult.tokensUsed}</span>
                    ) : null}
                    <span className={styles.metaTag}>MATCHED MEMORIES: {simResult.matchedMemories?.length || 0}</span>
                  </div>

                  <div className={styles.aiReplyBox}>
                    <strong style={{ display: "block", fontSize: "0.75rem", color: "var(--color-secondary)", marginBottom: "0.25rem" }}>
                      AI ASSISTANT RESPONSE:
                    </strong>
                    {simResult.reply}
                  </div>

                  {simResult.matchedMemories && simResult.matchedMemories.length > 0 && (
                    <div>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Retrieved RAG Facts Injected Into LLM Prompt:
                      </span>
                      <div className={styles.matchedMemoriesList}>
                        {simResult.matchedMemories.map((m, mIdx) => (
                          <div key={mIdx} className={styles.matchedMemoryItem}>
                            <div>
                              <strong style={{ color: "var(--color-primary)" }}>{m.topic}</strong>{" "}
                              <span style={{ color: "var(--color-text-muted)" }}>({m.category})</span>
                              <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                                {m.answer}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", minWidth: "90px" }}>
                              <span className={`${styles.priorityBadge} ${m.priority >= 4 ? styles.priorityHigh : styles.priorityMedium}`}>
                                Score: {m.relevanceScore || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Category Filter Pills */}
          <div className={styles.categoryFilterBar}>
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.categoryFilterBtn} ${
                  memoryCategoryFilter === cat ? styles.categoryFilterBtnActive : ""
                }`}
                onClick={() => setMemoryCategoryFilter(cat)}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className={styles.searchContainer}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
              <Search size={15} color="var(--color-text-muted)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search knowledge topics, keywords, or answers..."
                value={memorySearchTerm}
                onChange={(e) => setMemorySearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Trigger Keywords</th>
                  <th style={{ width: "35%" }}>Verified Truth / Answer</th>
                  <th>Active</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {botMemories
                  .filter((m) => {
                    if (memoryCategoryFilter !== "all" && m.category !== memoryCategoryFilter) {
                      return false;
                    }
                    if (memorySearchTerm.trim()) {
                      const term = memorySearchTerm.toLowerCase();
                      const matchTopic = (m.topic || "").toLowerCase().includes(term);
                      const matchAnswer = (m.answer || "").toLowerCase().includes(term);
                      const matchKeywords = (m.keywords || []).some((k) => k.toLowerCase().includes(term));
                      return matchTopic || matchAnswer || matchKeywords;
                    }
                    return true;
                  })
                  .map((m) => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 600 }}>{m.topic}</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{m.category}</span>
                      </td>
                      <td>
                        <span
                          className={`${styles.priorityBadge} ${
                            m.priority >= 5
                              ? styles.priorityHigh
                              : m.priority >= 3
                              ? styles.priorityMedium
                              : styles.priorityNormal
                          }`}
                        >
                          P{m.priority || 1}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                          {m.keywords?.map((k, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: "0.6875rem",
                                backgroundColor: "#ffffff",
                                border: "1px solid var(--color-border-subtle)",
                                padding: "0.1rem 0.4rem",
                              }}
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.8125rem", lineHeight: 1.45 }}>{m.answer}</td>
                      <td>
                        <button
                          type="button"
                          style={{ background: "transparent", border: "none", cursor: "pointer" }}
                          onClick={() => handleToggleMemoryActive(m)}
                          title="Click to toggle active state"
                        >
                          {m.isActive ? (
                            <CheckCircle2 size={16} color="#166534" />
                          ) : (
                            <XCircle size={16} color="#800020" />
                          )}
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            title="Edit Memory"
                            onClick={() => openEditModal("botMemory", m)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                            title="Delete Memory"
                            onClick={() => handleDelete("botMemory", m._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 6. RESOURCES TAB (Cloudinary PDFs) */}
      {activeTab === "resources" && (
        <section>
          <div className={styles.tabHeader}>
            <div>
              <h2 className={styles.tabTitle}>Uploaded PDF Library & Cloudinary Documents</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                Upload new PDF guides directly from your device. Files are automatically hosted on Cloudinary and instantly accessible on the public website.
              </p>
            </div>
            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => openCreateModal("resource")}
            >
              <Plus size={15} />
              <span>Upload PDF Document</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DOCUMENT NAME</th>
                  <th>WHAT IT IS ABOUT</th>
                  <th>SPECS</th>
                  <th>DOCUMENT LINK</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      No PDF documents uploaded yet.
                    </td>
                  </tr>
                ) : (
                  resources.map((item) => (
                    <tr key={item.id || item._id}>
                      <td style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                        {item.title}
                      </td>
                      <td style={{ maxWidth: "340px", fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                        {item.summary || item.description}
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                        {item.fileSize || "PDF"} &bull; {item.pagesCount ? `${item.pagesCount} pages` : "Document"}
                      </td>
                      <td>
                        <a
                          href={`${API_BASE}/resources/${item.id}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "var(--color-primary)",
                            textDecoration: "underline",
                          }}
                        >
                          <Eye size={12} />
                          <span>See Document</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            title="Edit Details"
                            onClick={() => openEditModal("resource", item)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                            title="Delete Document"
                            onClick={() => handleDelete("resource", item.id || item._id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 7. USER CHAT AUDIT & SAFETY LOGS TAB */}
      {activeTab === "userChats" && (
        <section>
          <div className={styles.tabHeader}>
            <div>
              <h2 className={styles.tabTitle}>User Chat Logs & Safety Management</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                Audit transcripts of user conversations with the AI companion. As Master Admin, you can inspect safety responses, verify answers, and permanently delete any user chat records from MongoDB.
              </p>
            </div>
            {userChatLogs.length > 0 && (
              <button
                type="button"
                className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                onClick={handleClearAllUserChats}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.78125rem",
                  fontWeight: 600,
                  color: "#800020",
                  borderColor: "#800020",
                  borderRadius: "var(--radius-xs)",
                }}
                title="Permanently wipe all user chat logs from database"
              >
                <Trash2 size={14} />
                <span>Purge All Chat Logs</span>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className={styles.chatAuditStatsRow}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{chatAuditStats.totalSessions || userChatLogs.length}</div>
              <div className={styles.statLabel}>Total Chat Sessions</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {userChatLogs.filter((l) => !l.clientDeleted).length}
              </div>
              <div className={styles.statLabel}>Active On Client</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {chatAuditStats.clientCleared || userChatLogs.filter((l) => l.clientDeleted).length}
              </div>
              <div className={styles.statLabel}>Cleared by User (In DB)</div>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className={styles.filterControlsRow}>
            <div className={styles.searchBox}>
              <Search size={14} color="var(--color-text-subtle)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search transcripts by question, reply, or topic..."
                value={chatSearchTerm}
                onChange={(e) => setChatSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.segmentedFilter}>
              <button
                type="button"
                className={`${styles.segmentedBtn} ${chatStatusFilter === "all" ? styles.segmentedBtnActive : ""}`}
                onClick={() => setChatStatusFilter("all")}
              >
                All Logs
              </button>
              <button
                type="button"
                className={`${styles.segmentedBtn} ${chatStatusFilter === "active" ? styles.segmentedBtnActive : ""}`}
                onClick={() => setChatStatusFilter("active")}
              >
                Active On Client
              </button>
              <button
                type="button"
                className={`${styles.segmentedBtn} ${chatStatusFilter === "deleted" ? styles.segmentedBtnActive : ""}`}
                onClick={() => setChatStatusFilter("deleted")}
              >
                Cleared by User
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Session & Question</th>
                  <th>User</th>
                  <th>Latest Message Preview</th>
                  <th>Messages</th>
                  <th>Client State</th>
                  <th>Last Activity</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userChatLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                      No conversation logs found matching criteria.
                    </td>
                  </tr>
                ) : (
                  userChatLogs.map((log) => (
                    <tr key={log._id || log.sessionId}>
                      <td style={{ fontWeight: 600, color: "var(--color-primary)", maxWidth: "220px" }}>
                        <div>{log.sessionTitle || "Conversation"}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-text-subtle)", fontWeight: 400, marginTop: "0.2rem" }}>
                          &ldquo;{log.firstQuestion}&rdquo;
                        </div>
                      </td>

                      <td style={{ fontSize: "0.8125rem", color: "var(--color-text-main)", whiteSpace: "nowrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          <User size={13} color="var(--color-secondary)" />
                          <strong>{log.userIdentifier || "Vanshika"}</strong>
                        </span>
                      </td>

                      <td style={{ maxWidth: "280px", fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-subtle)", display: "block" }}>
                          {log.lastSender === "user" ? "User asked:" : "Bot replied:"}
                        </span>
                        {log.lastPreview}
                      </td>

                      <td style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                        {log.totalMessages} msgs
                      </td>

                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            log.clientDeleted ? styles.statusDeleted : styles.statusActive
                          }`}
                        >
                          {log.clientDeleted ? "Cleared by User" : "Active on Client"}
                        </span>
                      </td>

                      <td style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                        {formatRelativeTime(log.lastActivityAt || log.createdAt)}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div className={styles.tableActions} style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className={styles.actionIconBtn}
                            title="Inspect Full Transcript"
                            onClick={() => handleInspectChatLog(log.sessionId)}
                            style={{ padding: "0.35rem 0.65rem", display: "inline-flex", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 600 }}
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                            title="Permanently Delete User Chat"
                            onClick={() => handleDeleteUserChat(log.sessionId, log.sessionTitle)}
                            style={{ padding: "0.35rem 0.5rem" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FULL CHAT TRANSCRIPT INSPECTOR MODAL */}
      {selectedChatSession && (
        <Modal
          isOpen={Boolean(selectedChatSession)}
          onClose={() => setSelectedChatSession(null)}
          title={`Audit Transcript: ${selectedChatSession.sessionTitle || "Conversation"}`}
          size="lg"
        >
          <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem" }}>
              <User size={14} color="var(--color-secondary)" />
              <span>User: <strong>{selectedChatSession.userIdentifier || "Vanshika"}</strong></span>
              <span>&bull;</span>
              <span>Session ID: <code style={{ fontSize: "0.75rem" }}>{selectedChatSession.sessionId}</code></span>
            </div>

            <span
              className={`${styles.statusBadge} ${
                selectedChatSession.clientDeleted ? styles.statusDeleted : styles.statusActive
              }`}
            >
              {selectedChatSession.clientDeleted ? "Cleared on Client View (Preserved in DB)" : "Active on Client"}
            </span>
          </div>

          <div className={styles.transcriptContainer}>
            {selectedChatSession.messages?.map((msg, idx) => (
              <div
                key={msg.id || msg._id || idx}
                className={`${styles.transcriptMsg} ${
                  msg.sender === "user" ? styles.transcriptUser : styles.transcriptAssistant
                }`}
              >
                <div className={styles.transcriptBubble}>{msg.text}</div>
                <div className={styles.transcriptMeta}>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  {msg.source && <span>&bull; Source: {msg.source}</span>}
                  {msg.model && <span>&bull; Model: {msg.model}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <button
              type="button"
              className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
              onClick={() => handleDeleteUserChat(selectedChatSession.sessionId, selectedChatSession.sessionTitle)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#800020",
                borderColor: "#800020",
                borderRadius: "var(--radius-xs)",
              }}
            >
              <Trash2 size={14} />
              <span>Permanently Delete Chat</span>
            </button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedChatSession(null)}
            >
              Close Audit
            </Button>
          </div>
        </Modal>
      )}

      {/* CRUD MODAL */}
      {modalType && (
        <Modal
          isOpen={Boolean(modalType)}
          onClose={() => setModalType(null)}
          title={
            modalType === "story"
              ? isEditing ? "Edit Archive Essay" : "Create New Archive Essay"
              : modalType === "safety"
              ? isEditing ? "Edit Safety Protocol" : "Add New Safety Protocol"
              : modalType === "ack"
              ? isEditing ? "Edit Ledger Entry" : "Pen New Acknowledgment"
              : modalType === "resource"
              ? isEditing ? "Edit Document Details" : "Upload New PDF to Cloudinary & Database"
              : isEditing ? "Edit AI Chatbot Knowledge Memory" : "Feed New Knowledge to AI Assistant"
          }
          size="lg"
        >
          <form className={styles.modalForm} onSubmit={handleFormSubmit}>
            {/* Story Form */}
            {modalType === "story" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>STORY SLUG / ID</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      disabled={isEditing}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>TAG / CATEGORY</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>TITLE</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>SUBTITLE</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>INITIAL PARAGRAPHS (Double newline separated)</label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: "110px" }}
                    value={formData.paragraphs}
                    onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>PULL QUOTE</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.pullQuote}
                    onChange={(e) => setFormData({ ...formData, pullQuote: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>REMAINING PARAGRAPHS (Double newline separated)</label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: "110px" }}
                    value={formData.remainingParagraphs}
                    onChange={(e) => setFormData({ ...formData, remainingParagraphs: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Safety Protocol Form */}
            {modalType === "safety" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>SCENARIO ID</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      disabled={isEditing}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>DISPLAY NUM (e.g. 01, 16)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.num}
                      onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>CATEGORY</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>RISK LEVEL</label>
                    <select
                      className={styles.select}
                      value={formData.riskLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          riskLevel: e.target.value,
                          riskBadge: e.target.value.toUpperCase(),
                        })
                      }
                    >
                      <option value="Concerning">Concerning</option>
                      <option value="Escalating">Escalating</option>
                      <option value="Immediate Danger">Immediate Danger</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>TITLE</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>SUMMARY</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>OVERVIEW</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Acknowledgment Form */}
            {modalType === "ack" && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>GRATITUDE REFLECTION / QUOTE</label>
                  <textarea
                    className={styles.textarea}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>AUTHOR / SIGNATURE</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. S. D."
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>LOCATION / METADATA</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Conversation Archive"
                      value={formData.meta}
                      onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Bot Memory Form */}
            {modalType === "botMemory" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>TOPIC / SCENARIO NAME</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. River Ganga Conversation"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>CATEGORY</label>
                    <select
                      className={styles.select}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="About Her (Vanshika)">About Her (Vanshika)</option>
                      <option value="About Him (Manik)">About Him (Manik)</option>
                      <option value="Shared Memories & Moments">Shared Memories & Moments</option>
                      <option value="Creative Passions">Creative Passions</option>
                      <option value="Safety & Boundaries">Safety & Boundaries</option>
                      <option value="Mindfulness & Reflection">Mindfulness & Reflection</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>TRIGGER KEYWORDS (Comma separated)</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. ganga, river, call, 11:53, photos"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>RAG PRIORITY (1 to 5)</label>
                    <select
                      className={styles.select}
                      value={formData.priority || 1}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    >
                      <option value={5}>P5 - Critical / Highest RAG Boost</option>
                      <option value={4}>P4 - Very High Priority</option>
                      <option value={3}>P3 - High Priority</option>
                      <option value={2}>P2 - Normal Priority</option>
                      <option value={1}>P1 - Standard / Low</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>TRAINED FACT / ASSISTANT RESPONSE</label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: "120px" }}
                    placeholder="Write the exact facts, truth, or reflection the AI chatbot should ground its answer on when asked about this topic..."
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.isActive !== undefined ? formData.isActive : true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActiveCheck" style={{ fontSize: "0.8125rem", cursor: "pointer", color: "var(--color-primary)" }}>
                    Active (Inject into RAG Assistant retrieval)
                  </label>
                </div>
              </>
            )}

            {/* PDF Resource Form */}
            {modalType === "resource" && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>PDF NAME / DOCUMENT TITLE</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Women's Safety & Emotional Wellbeing Guide"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>WHAT IT IS ABOUT (SUMMARY / DESCRIPTION)</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="A brief overview of what this document covers..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value, description: e.target.value })}
                    required
                    style={{ minHeight: "90px" }}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    {isEditing ? "REPLACE PDF FILE (OPTIONAL)" : "SELECT PDF FILE (AUTO-UPLOAD TO CLOUDINARY)"}
                  </label>
                  <input
                    type="file"
                    id="adminPdfFileInput"
                    accept=".pdf,application/pdf"
                    className={styles.input}
                    style={{ padding: "0.5rem" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem", display: "block" }}>
                    Select any .pdf file from your computer. It will automatically upload to Cloudinary and register in the database.
                  </span>
                </div>

                {isEditing && formData.cloudinaryPublicId && (
                  <div className={styles.field}>
                    <label className={styles.label}>CURRENT CLOUDINARY ASSET ID</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.cloudinaryPublicId}
                      readOnly
                      disabled
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                )}
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <Button type="button" variant="secondary" size="sm" onClick={() => setModalType(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save to Database
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Floating Sandbot Master Copilot Trigger */}
      <button
        type="button"
        className={styles.floatingSandbotBtn}
        onClick={() => setIsSandbotOpen((prev) => !prev)}
        title="Open Sandbot Master Database Copilot"
      >
        <div className={styles.pulseDot} />
        <Bot size={15} />
        <span>Sandbot Copilot</span>
      </button>

      {/* Admin Sandbot Drawer */}
      <AdminSandbotDrawer
        isOpen={isSandbotOpen}
        onClose={() => setIsSandbotOpen(false)}
        onDataMutated={fetchTabData}
        onPrefillForm={handlePrefillFromAi}
      />

      <Toast message={toastMessage} type="success" onClose={() => setToastMessage("")} />
    </div>
  );
};

export default Admin;
