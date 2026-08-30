import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenTool, ChevronDown, ChevronUp, Layers, ArrowUpRight } from "lucide-react";
import Modal from "../components/common/Modal/Modal";
import Button from "../components/common/Button/Button";
import Toast from "../components/common/Toast/Toast";
import { useAuth } from "../hooks/useAuth";
import { getReadingTime, isItemRead, getReadItems } from "../utils/readingTracker";
import { formatRelativeTime } from "../utils/timeUtils";
import { API_BASE } from "../config/api";
import styles from "./Stories.module.css";

const categories = [
  "ALL ENTRIES",
  "Restoration Series",
  "Acoustic Memory",
  "Quiet Craft",
  "Cultural Resonance",
  "Emotional Boundaries",
  "Personal Archives",
  "Emotional Geography",
];

const Stories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("ALL ENTRIES");
  const [searchQuery, setSearchQuery] = useState("");
  const [storiesList, setStoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Minimal Collapsible & Read Filter State
  const [showCategories, setShowCategories] = useState(false);
  const [readFilter, setReadFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [readStoryIds, setReadStoryIds] = useState([]);

  // Story Posting Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    tag: "Restoration Series",
    pullQuote: "",
    paragraphs: "",
  });

  // Fetch strictly from MongoDB
  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setStoriesList(resData.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load stories from MongoDB:", err);
      })
      .finally(() => {
        setLoading(false);
      });

    setReadStoryIds(getReadItems("stories"));
  }, []);

  const handleOpenCreateModal = () => {
    const defaultAuthor =
      user?.role === "master_admin" || user?.username === "developermanikdas"
        ? user?.fullName || "Manik"
        : user?.fullName || "Vanshika";
    setFormData({
      title: "",
      subtitle: "",
      author: defaultAuthor,
      tag: "Restoration Series",
      pullQuote: "",
      paragraphs: "",
    });
    setIsModalOpen(true);
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.paragraphs.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsedParagraphs = formData.paragraphs
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const response = await fetch(`${API_BASE}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          author: formData.author.trim() || "Vanshika",
          tag: formData.tag.trim() || "Restoration Series",
          pullQuote: formData.pullQuote.trim(),
          paragraphs: parsedParagraphs,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setStoriesList((prev) => [resData.data, ...prev]);
        setIsModalOpen(false);
        setToastMessage("Your essay has been penned and published to the archive.");
      } else {
        setToastMessage(resData.message || "Failed to publish story.");
      }
    } catch {
      setToastMessage("Network error. Could not connect to the archive database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStories = storiesList.filter((item) => {
    const matchesCategory =
      activeTab === "ALL ENTRIES" ||
      (item.tag && item.tag.toLowerCase() === activeTab.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.paragraphs && item.paragraphs.some((p) => p.toLowerCase().includes(q)));

    const isRead = readStoryIds.includes(String(item.id || item._id));
    const matchesReadFilter =
      readFilter === "all" ||
      (readFilter === "read" && isRead) ||
      (readFilter === "unread" && !isRead);

    return matchesCategory && matchesSearch && matchesReadFilter;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>The Stories Archive</h1>
          <div className={styles.titleBar} />
          <p className={styles.subtitle}>
            A curated collection of thoughts, meditative essays, and reflections.
            Documented with precision and shared for quiet contemplation.
          </p>
        </div>

        <button
          type="button"
          className={styles.writeEssayBtn}
          onClick={handleOpenCreateModal}
        >
          <PenTool size={14} />
          <span>WRITE AN ESSAY</span>
        </button>
      </header>

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
              <span>Categories {activeTab !== "ALL ENTRIES" ? `(${activeTab})` : ""}</span>
              {showCategories ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Read Status Segmented Filter */}
            <div className={styles.filterSegmented} role="group" aria-label="Filter by reading status">
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
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Collapsible Categories Panel */}
        {showCategories && (
          <div className={styles.categoriesDrawer}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.tabBtn} ${
                  activeTab === cat ? styles.activeTabBtn : ""
                }`}
                onClick={() => {
                  setActiveTab(cat);
                  setShowCategories(false);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {loading ? (
        <div style={{ textAlign: "left", padding: "4rem 0", color: "var(--color-text-subtle)", fontStyle: "italic" }}>
          Retrieving stories from the archive...
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => {
              const readTime = getReadingTime(story.paragraphs);
              const relativeDate = formatRelativeTime(story.createdAt || story.date);

              return (
                <article
                  key={story._id || story.id}
                  className={styles.card}
                  onClick={() => navigate(`/stories/${story.id}`)}
                >
                  {/* 1. Title at top */}
                  <h2 className={styles.cardTitle}>{story.title}</h2>

                  {/* 2. Paragraph Excerpt */}
                  <p className={styles.excerpt}>
                    {story.paragraphs?.[0] || story.story || story.subtitle || ""}
                  </p>

                  {/* 3. Subtle Author */}
                  <div className={styles.authorSignature}>
                    By {story.author || "Vanshika"}
                  </div>

                  {/* 4. Minimal Bottom Row */}
                  <div className={styles.cardFooter}>
                    <div className={styles.metaLeft}>
                      <span>{relativeDate}</span>
                      <span className={styles.dotSeparator}>&bull;</span>
                      <span>{readTime}</span>
                    </div>

                    <div className={styles.arrowIcon}>
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className={styles.noResults}>
              No entries found matching your criteria.
            </p>
          )}
        </div>
      )}

      {/* Write Story Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pen an Essay for the Archive"
        size="lg"
      >
        <form className={styles.modalForm} onSubmit={handleCreateStory}>
          <div className={styles.field}>
            <label className={styles.label}>ESSAY TITLE</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. The Quiet Rhythm of Sitar"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>CATEGORY / TAG</label>
              <select
                className={styles.select}
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="Restoration Series">Restoration Series</option>
                <option value="Acoustic Memory">Acoustic Memory</option>
                <option value="Quiet Craft">Quiet Craft</option>
                <option value="Cultural Resonance">Cultural Resonance</option>
                <option value="Emotional Boundaries">Emotional Boundaries</option>
                <option value="Personal Archives">Personal Archives</option>
                <option value="Emotional Geography">Emotional Geography</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>PEN NAME / AUTHOR</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Vanshika or Manik"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>SUBTITLE / ESSAY THEME (OPTIONAL)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. A reflection on quiet evenings and wooden resonance"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PULL QUOTE / HIGHLIGHT (OPTIONAL)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. In quiet spaces, thoughts settle like dust after rain."
              value={formData.pullQuote}
              onChange={(e) => setFormData({ ...formData, pullQuote: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>ESSAY TEXT (Separate paragraphs with double enter)</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your story here..."
              value={formData.paragraphs}
              onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
              required
              disabled={isSubmitting}
              style={{ minHeight: "150px" }}
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
              {isSubmitting ? "Publishing..." : "Publish to Archive"}
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

export default Stories;
