import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldAlert, Smartphone, ExternalLink, ChevronDown, ChevronUp, Layers, ArrowUpRight, Plus } from "lucide-react";
import Modal from "../components/common/Modal/Modal";
import Button from "../components/common/Button/Button";
import Toast from "../components/common/Toast/Toast";
import { useAuth } from "../hooks/useAuth";
import { getReadItems } from "../utils/readingTracker";
import { API_BASE } from "../config/api";
import styles from "./SafetyHub.module.css";

const defaultCategories = [
  { id: "all", label: "ALL SCENARIOS" },
  { id: "harassment", label: "EVERYDAY PUBLIC HARASSMENT" },
  { id: "commuting", label: "WALKING & COMMUTING" },
  { id: "workplace", label: "WORKPLACE / POSH" },
  { id: "stalking", label: "STALKING & HARASSMENT" },
  { id: "digital", label: "DIGITAL & ONLINE" },
];

const getRiskLabel = (sc) => {
  const level = (sc.riskLevel || sc.riskBadge || "").toLowerCase();
  if (
    level.includes("danger") ||
    level.includes("severe") ||
    level.includes("immediate") ||
    level.includes("critical") ||
    level.includes("red")
  ) {
    return { label: "Critical", classKey: "riskCritical" };
  }
  if (level.includes("high") || level.includes("escalat") || level.includes("orange")) {
    return { label: "High", classKey: "riskHigh" };
  }
  return { label: "Low", classKey: "riskLow" };
};

const SafetyHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Minimal Collapsible & Read Filter State
  const [showCategories, setShowCategories] = useState(false);
  const [readFilter, setReadFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [readScenarioIds, setReadScenarioIds] = useState([]);

  // Request Protocol Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "EVERYDAY PUBLIC HARASSMENT",
    details: "",
    requester: "",
  });

  // Fetch strictly from MongoDB backend API
  useEffect(() => {
    fetch(`${API_BASE}/safety`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setScenarios(resData.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load safety scenarios from MongoDB:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    setReadScenarioIds(getReadItems("safety"));
  }, []);

  const handleOpenRequestModal = () => {
    const defaultName =
      user?.role === "master_admin" || user?.username === "developermanikdas"
        ? user?.fullName || "Manik"
        : user?.fullName || "Vanshika";

    setFormData({
      title: "",
      category: "EVERYDAY PUBLIC HARASSMENT",
      details: "",
      requester: defaultName,
    });
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.details.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formattedSuggestion = `[Safety Scenario Request - ${formData.category}] ${formData.title.trim()}\n\nDetails & Context:\n${formData.details.trim()}`;

      const response = await fetch(`${API_BASE}/features/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion: formattedSuggestion,
          user: formData.requester.trim() || "Vanshika",
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setIsModalOpen(false);
        setToastMessage("Your situation protocol request has been submitted for drafting.");
      } else {
        setToastMessage(resData.message || "Failed to submit request.");
      }
    } catch {
      setToastMessage("Network error. Could not connect to the archive database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredScenarios = scenarios.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      item.categoryId === activeCategory ||
      (activeCategory === "stalking" && item.category?.toLowerCase().includes("stalking")) ||
      (activeCategory === "digital" && item.category?.toLowerCase().includes("digital"));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q);

    const isRead = readScenarioIds.includes(String(item.id || item._id));
    const matchesReadFilter =
      readFilter === "all" ||
      (readFilter === "read" && isRead) ||
      (readFilter === "unread" && !isRead);

    return matchesCategory && matchesSearch && matchesReadFilter;
  });

  const activeCategoryObj = defaultCategories.find((c) => c.id === activeCategory);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Safety Hub</h1>
          <div className={styles.titleBar} />
          <p className={styles.subtitle}>
            A curated archive of situational awareness protocols and safety
            scenarios. Navigate the complexities of public and private spaces with
            informed, practical guidance.
          </p>
        </div>

        <button
          type="button"
          className={styles.requestBtn}
          onClick={handleOpenRequestModal}
        >
          <Plus size={14} />
          <span>REQUEST A SITUATION</span>
        </button>
      </header>

      {/* Ultra-Minimal Emergency & SOS Strip */}
      <aside className={styles.emergencyStrip} aria-label="Crisis Helplines and SOS">
        <div className={styles.emergencyLeft}>
          <ShieldAlert size={15} color="var(--color-secondary, #800020)" />
          <span className={styles.emergencyLabel}>Helplines:</span>
          <a href="tel:112" className={styles.helplineLink} title="National Emergency">
            National: <strong>112</strong>
          </a>
          <span className={styles.dot}>&bull;</span>
          <a href="tel:1091" className={styles.helplineLink} title="Women in Distress">
            Women: <strong>1091</strong>
          </a>
          <span className={styles.dot}>&bull;</span>
          <a href="tel:14416" className={styles.helplineLink} title="Tele-MANAS Mental Health">
            Tele-MANAS: <strong>14416</strong>
          </a>
        </div>

        <a
          href="https://play.google.com/store/apps/details?id=in.cdac.ners.psa.mobile.android.national"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sosAppLink}
          title="Official 112 India Govt. Emergency SOS App on Google Play"
        >
          <Smartphone size={13} />
          <span>112 India SOS App</span>
          <ExternalLink size={11} />
        </a>
      </aside>

      {/* Minimalist Filter & Controls Section */}
      <section className={styles.filterBar}>
        <div className={styles.controlsRow}>
          <div className={styles.leftControls}>
            {/* Collapsible Categories Toggle */}
            <button
              type="button"
              className={`${styles.toggleBtn} ${showCategories ? styles.toggleBtnActive : ""}`}
              onClick={() => setShowCategories((prev) => !prev)}
            >
              <Layers size={13} />
              <span>Categories {activeCategory !== "all" ? `(${activeCategoryObj?.label || activeCategory})` : ""}</span>
              {showCategories ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Read Status Segmented Filter */}
            <div className={styles.filterSegmented} role="group" aria-label="Filter protocols by reading status">
              <button
                type="button"
                className={`${styles.segmentBtn} ${readFilter === "all" ? styles.segmentBtnActive : ""}`}
                onClick={() => setReadFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${readFilter === "unread" ? styles.segmentBtnActive : ""}`}
                onClick={() => setReadFilter("unread")}
              >
                Unread
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${readFilter === "read" ? styles.segmentBtnActive : ""}`}
                onClick={() => setReadFilter("read")}
              >
                Read
              </button>
            </div>
          </div>

          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search 50+ protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Collapsible Categories Panel */}
        {showCategories && (
          <div className={styles.categoriesDrawer}>
            {defaultCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.tabBtn} ${
                  activeCategory === cat.id ? styles.activeTabBtn : ""
                }`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowCategories(false);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {loading ? (
        <div style={{ textAlign: "left", padding: "4rem 0", color: "var(--color-text-subtle)", fontStyle: "italic" }}>
          Loading situational awareness protocols from database...
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredScenarios.length > 0 ? (
            filteredScenarios.map((sc) => {
              const risk = getRiskLabel(sc);

              return (
                <article
                  key={sc._id || sc.id}
                  className={styles.card}
                  onClick={() => navigate(`/safety-hub/scenario/${sc.id}`)}
                >
                  {/* Top Meta: Subtle Number & Clean Text Risk Indicator (No Background) */}
                  <div className={styles.cardMeta}>
                    <span className={styles.scenarioNum}>
                      #{String(sc.num).padStart(2, "0")}
                    </span>

                    <span className={`${styles.riskText} ${styles[risk.classKey]}`}>
                      {risk.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className={styles.cardTitle}>{sc.title}</h2>

                  {/* Summary */}
                  <p className={styles.cardSummary}>{sc.summary}</p>

                  {/* Minimal Footer: Arrow Only on Right */}
                  <div className={styles.cardFooter}>
                    <div className={styles.arrowIcon}>
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className={styles.noResults}>
              No safety protocols found matching your criteria.
            </p>
          )}
        </div>
      )}

      {/* Request Situation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request a Situational Protocol"
        size="md"
      >
        <form className={styles.modalForm} onSubmit={handleSendRequest}>
          <div className={styles.field}>
            <label className={styles.label}>SITUATION TITLE</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Solo late-night cab ride precautions"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>CATEGORY</label>
              <select
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="EVERYDAY PUBLIC HARASSMENT">Everyday Public Harassment</option>
                <option value="WALKING & COMMUTING">Walking & Commuting</option>
                <option value="WORKPLACE / POSH">Workplace / POSH</option>
                <option value="STALKING & HARASSMENT">Stalking & Harassment</option>
                <option value="DIGITAL & ONLINE">Digital & Online</option>
                <option value="OTHER SITUATION">Other Situation</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>REQUESTED BY</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Vanshika or Manik"
                value={formData.requester}
                onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>DETAILS & GUIDANCE NEEDED</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe the situation, specific concerns, or verbal boundaries you'd like added to the archive..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Protocol Request"}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />
    </div>
  );
};

export default SafetyHub;
