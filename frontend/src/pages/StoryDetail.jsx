import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import Toast from "../components/common/Toast/Toast";
import { API_BASE } from "../config/api";
import styles from "./StoryDetail.module.css";

import { markItemAsRead } from "../utils/readingTracker";

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [reflectionText, setReflectionText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch story details from MongoDB
  useEffect(() => {
    if (!id) return;
    setStoryLoading(true);
    fetch(`${API_BASE}/stories/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setStory(resData.data);
          markItemAsRead("stories", resData.data.id || resData.data._id || id);
        }
      })
      .catch((err) => {
        console.error("Failed to load story from MongoDB:", err);
      })
      .finally(() => {
        setStoryLoading(false);
      });
  }, [id]);

  // Fetch real database comments on load
  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/stories/${id}/comments`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setComments(resData.data);
        } else {
          setComments([]);
        }
      })
      .catch(() => {
        setComments([]);
      });
  }, [id]);

  const handleAddReflection = async (e) => {
    e.preventDefault();
    if (!reflectionText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/stories/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: authorName.trim() || "Anonymous Reader",
          text: reflectionText.trim(),
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setComments((prev) => [resData.data, ...prev]);
        setReflectionText("");
        setAuthorName("");
        setToastMessage("Your reflection has been recorded to the database.");
      } else {
        setToastMessage("Could not save reflection. Please try again.");
      }
    } catch {
      setToastMessage("Network error. Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setToastMessage("Archive link copied to clipboard.");
  };

  const formatCommentDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  if (storyLoading) {
    return (
      <div className={styles.container}>
        <p style={{ color: "var(--color-text-subtle)", fontStyle: "italic", padding: "4rem 0" }}>
          Retrieving entry from the archive...
        </p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className={styles.container}>
        <p style={{ color: "var(--color-text-subtle)", fontStyle: "italic", padding: "4rem 0" }}>
          Entry not found in archive.
        </p>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/stories")}
        >
          <ArrowLeft size={16} />
          Back to Archives
        </button>
      </div>
    );
  }

  return (
    <article className={styles.container}>
      <nav className={styles.topNav}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/stories")}
        >
          <ArrowLeft size={16} />
          Back to Archives
        </button>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleShare}
            title="Share Entry"
          >
            <Share2 size={16} />
          </button>
        </div>
      </nav>

      <header className={styles.articleHeader}>
        <div className={styles.entryMeta}>
          <span className={styles.entryTag}>{story.entryNo || story.tag}</span>
          <span className={styles.entryDate}>{story.date}</span>
        </div>

        <h1 className={styles.title}>{story.title}</h1>
        {story.subtitle && <p className={styles.subtitle}>{story.subtitle}</p>}
      </header>

      <div className={styles.contentBody}>
        {story.paragraphs?.map((p, idx) => (
          <p key={idx} className={styles.paragraph}>
            {p}
          </p>
        ))}

        {story.story && <p className={styles.paragraph}>{story.story}</p>}

        {story.pullQuote && (
          <blockquote className={styles.pullQuote}>
            &ldquo;{story.pullQuote}&rdquo;
          </blockquote>
        )}

        {story.remainingParagraphs?.map((p, idx) => (
          <p key={idx} className={styles.paragraph}>
            {p}
          </p>
        ))}
      </div>

      <footer className={styles.articleFooter}>
        <div className={styles.reflectionsHeader}>
          <h2 className={styles.reflectionsTitle}>Reader Reflections</h2>
          <span className={styles.reflectionBadge}>
            {comments.length} Recorded
          </span>
        </div>

        <form className={styles.reflectionForm} onSubmit={handleAddReflection}>
          <textarea
            className={styles.reflectionInput}
            placeholder="Pen a quiet reflection on this entry..."
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.authorInput}
              placeholder="Your Name (e.g. S. D.)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!reflectionText.trim() || isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Submit Reflection"}
            </button>
          </div>
        </form>

        <div className={styles.reflectionsList}>
          {comments.length > 0 ? (
            comments.map((item) => (
              <div key={item._id || item.id} className={styles.reflectionCard}>
                <div className={styles.refCardHeader}>
                  <span className={styles.refAuthor}>{item.author}</span>
                  <span className={styles.refTime}>
                    {formatCommentDate(item.createdAt)}
                  </span>
                </div>
                <p className={styles.refText}>{item.text}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--color-text-subtle)", fontStyle: "italic", fontSize: "0.875rem" }}>
              No reflections recorded yet for this entry. Pen the first reflection above.
            </p>
          )}
        </div>
      </footer>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />
    </article>
  );
};

export default StoryDetail;
