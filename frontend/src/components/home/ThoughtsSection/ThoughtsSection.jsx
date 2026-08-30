import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";
import styles from "./ThoughtsSection.module.css";

const ThoughtsSection = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);

  // Fetch strictly from MongoDB
  useEffect(() => {
    fetch(`${API_BASE}/stories`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setStories(resData.data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Failed to load thoughts from MongoDB:", err);
      });
  }, []);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.sectionTag}>THE ARCHIVE ESSAYS</span>
          <h2 className={styles.title}>Thoughts from the Archive</h2>
          <p className={styles.subtitle}>
            Quiet reflections on tension, memory, boundaries, and craftsmanship.
          </p>
        </div>

        <button
          type="button"
          className={styles.seeAllLink}
          onClick={() => navigate("/stories")}
        >
          Explore All Essays &rarr;
        </button>
      </header>

      <div className={styles.grid}>
        {stories.map((story) => (
          <article
            key={story._id || story.id}
            className={styles.card}
            onClick={() => navigate(`/stories/${story.id}`)}
          >
            <span className={styles.entryTag}>{story.tag || story.entryNo}</span>
            <h3 className={styles.cardTitle}>{story.title}</h3>
            <p className={styles.excerpt}>
              {story.paragraphs?.[0] || story.subtitle || story.story || ""}
            </p>
            <span className={styles.readLink}>Read Entry &rarr;</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ThoughtsSection;
