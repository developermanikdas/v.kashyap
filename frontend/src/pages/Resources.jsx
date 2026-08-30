import { useState, useEffect } from "react";
import { Eye, ExternalLink } from "lucide-react";
import api from "../api/axios";
import styles from "./Resources.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await api.get("/resources");
        if (res.data?.success) {
          setResources(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resources</h1>
        <div className={styles.titleBar} />
        <p className={styles.subtitle}>
          Curated guides and documents available to view directly in your browser.
        </p>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading documents from archive...</div>
      ) : (
        <div className={styles.list}>
          {resources.map((item) => {
            const documentViewUrl = `${API_BASE_URL}/resources/${item.id}/view`;

            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.pdfName}>{item.title}</h2>
                  <span className={styles.fileBadge}>PDF Document</span>
                </div>
                <p className={styles.about}>{item.summary || item.description}</p>
                <div className={styles.cardFooter}>
                  <a
                    href={documentViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                  >
                    <Eye size={15} />
                    <span>See Document</span>
                    <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;
