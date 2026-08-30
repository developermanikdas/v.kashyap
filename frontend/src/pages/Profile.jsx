import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, LogOut, MessageSquare } from "lucide-react";
import { getReadItems } from "../utils/readingTracker";
import { API_BASE } from "../config/api";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [featureRequests, setFeatureRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [userAckCount, setUserAckCount] = useState(0);

  const readStoriesCount = getReadItems("stories").length;
  const readSafetyCount = getReadItems("safety").length;

  // Fetch real feature suggestions and acknowledgements from MongoDB
  useEffect(() => {
    fetch(`${API_BASE}/features/requests`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setFeatureRequests(resData.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load feature requests:", err);
      })
      .finally(() => {
        setLoadingRequests(false);
      });

    fetch(`${API_BASE}/acknowledgements`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setUserAckCount(resData.data.length);
        }
      })
      .catch((err) => {
        console.error("Failed to load acknowledgements count:", err);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initialLetter = (user?.fullName || user?.username || "A")
    .charAt(0)
    .toUpperCase();

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
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

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Archive Member</h1>
        <p className={styles.subtitle}>
          Personal ledger settings, saved scenarios, and reading preferences in The Many Strings.
        </p>
      </header>

      <div className={styles.sectionsList}>
        {/* Section 1: Member Identity */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>01 / Identity & Credentials</div>
          <div className={styles.identityCard}>
            <div className={styles.avatar}>{initialLetter}</div>
            <div className={styles.identityInfo}>
              <h2 className={styles.name}>{user?.fullName || "Archive Contributor"}</h2>
              <p className={styles.email}>
                @{user?.username || "reader"} &bull; {user?.email || "contributor@archive.org"}
              </p>
            </div>
            <div className={styles.badge}>Active Member</div>
          </div>
        </section>

        {/* Section 2: Archive Activity Stats */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>02 / Archive Engagement & Records</div>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>{readStoriesCount}</div>
              <div className={styles.statLabel}>Stories & Reflections Explored</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>{readSafetyCount}</div>
              <div className={styles.statLabel}>Safety Protocols & Scenarios Explored</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statNumber}>{userAckCount}</div>
              <div className={styles.statLabel}>Ledger Entries Penned</div>
            </div>
          </div>
        </section>

        {/* Section 3: Preferences */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>03 / Reading & Mindful Environment</div>
          <div className={styles.preferencesList}>
            <div className={styles.preferenceItem}>
              <div>
                <div className={styles.prefName}>Distraction-Free Editorial Layout</div>
                <div className={styles.prefDesc}>Focus on serif typography and clean margin notes.</div>
              </div>
              <div className={styles.prefStatus}>Enabled</div>
            </div>

            <div className={styles.preferenceItem}>
              <div>
                <div className={styles.prefName}>DEC Decision Framework Prompts</div>
                <div className={styles.prefDesc}>Guided assessment criteria on safety scenarios.</div>
              </div>
              <div className={styles.prefStatus}>Active</div>
            </div>

            <div className={styles.preferenceItem}>
              <div>
                <div className={styles.prefName}>Daily Quote Archive Refresher</div>
                <div className={styles.prefDesc}>Curated rotations from Marcus Aurelius & Archive Notes.</div>
              </div>
              <div className={styles.prefStatus}>Active</div>
            </div>
          </div>
        </section>

        {/* Section 4: Requested Features (Admin View) */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            04 / Requested Features & Community Submissions
          </div>

          <div className={styles.requestsContainer}>
            {loadingRequests ? (
              <div style={{ padding: "1.5rem", color: "var(--color-text-subtle)", fontStyle: "italic" }}>
                Fetching requested features from database...
              </div>
            ) : featureRequests.length > 0 ? (
              featureRequests.map((req) => (
                <div key={req._id} className={styles.requestItem}>
                  <div className={styles.requestHeader}>
                    <span className={styles.requestUser}>Submitted by: {req.user}</span>
                    <span className={styles.requestDate}>{formatDate(req.createdAt)}</span>
                  </div>
                  <p className={styles.requestText}>&ldquo;{req.suggestion}&rdquo;</p>
                  <span className={styles.statusPill}>Status: {req.status}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: "1.5rem", color: "var(--color-text-subtle)", fontStyle: "italic" }}>
                No feature requests submitted yet. Use the form on the homepage to suggest ideas.
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Session */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>05 / Session</div>
          <div className={styles.logoutArea}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
