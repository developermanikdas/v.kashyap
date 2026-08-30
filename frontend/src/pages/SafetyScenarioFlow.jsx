import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, Shield, Activity, ArrowLeft } from "lucide-react";
import { API_BASE } from "../config/api";
import styles from "./SafetyScenarioFlow.module.css";

import { markItemAsRead } from "../utils/readingTracker";

const SafetyScenarioFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedCriteria, setCheckedCriteria] = useState({});

  // Fetch protocol strictly from MongoDB
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/safety/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setProtocol(resData.data);
          markItemAsRead("safety", resData.data.id || resData.data._id || id);
        }
      })
      .catch((err) => {
        console.error("Failed to load scenario protocol from MongoDB:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleToggleCriteria = (idx) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: "var(--color-text-subtle)", fontStyle: "italic", padding: "4rem 0" }}>
          Retrieving protocol record from database...
        </p>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className={styles.container}>
        <p style={{ color: "var(--color-text-subtle)", fontStyle: "italic", padding: "4rem 0" }}>
          Protocol record not found in database.
        </p>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate("/safety-hub")}
        >
          <ArrowLeft size={13} style={{ display: "inline", marginRight: "4px" }} />
          Back to Safety Hub
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate("/safety-hub")}
          >
            <ArrowLeft size={13} style={{ display: "inline", marginRight: "4px" }} />
            Safety Hub
          </button>
          <span>/</span>
          <span>Scenario Record &mdash; {protocol.id}</span>
        </div>

        <div className={styles.riskBadge}>
          Risk Level: {protocol.riskLevel || protocol.riskBadge}
        </div>
      </div>

      <h1 className={styles.title}>{protocol.title}</h1>

      {/* 1. Scenario Overview */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <Eye size={18} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Scenario Overview</h2>
        </div>

        <p className={styles.overviewText}>{protocol.overview}</p>

        {protocol.assessmentCriteria?.length > 0 && (
          <div className={styles.criteriaBox}>
            <div className={styles.criteriaTitle}>Initial Assessment Criteria</div>
            <div className={styles.checkboxList}>
              {protocol.assessmentCriteria.map((crit, idx) => (
                <label key={idx} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={Boolean(checkedCriteria[idx])}
                    onChange={() => handleToggleCriteria(idx)}
                  />
                  <span>{crit}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Immediate Response Protocol */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <Activity size={18} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Immediate Response Protocol</h2>
        </div>

        <div className={styles.protocolGrid}>
          {/* Left Column: Verbal Scripts */}
          <div>
            <div className={styles.columnTitle}>Verbal Scripts</div>
            <div className={styles.scriptsList}>
              {protocol.verbalScripts?.map((script, idx) => (
                <div key={idx} className={styles.scriptBox}>
                  <blockquote className={styles.scriptQuote}>
                    &ldquo;{script.quote}&rdquo;
                  </blockquote>
                  <p className={styles.scriptCaption}>{script.caption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Prohibited Actions */}
          <div>
            <div className={`${styles.columnTitle} ${styles.columnTitleRed}`}>
              Prohibited Actions
            </div>
            <ul className={styles.prohibitedList}>
              {protocol.prohibitedActions?.map((action, idx) => (
                <li key={idx} className={styles.prohibitedItem}>
                  <span className={styles.crossIcon}>&#x2715;</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Escalation & Aftercare */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <Shield size={18} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Escalation & Aftercare</h2>
        </div>

        <div className={styles.escalationList}>
          {protocol.escalationSteps?.map((step, idx) => (
            <div key={idx} className={styles.escalationRow}>
              <div className={styles.escalationStage}>{step.stage}</div>
              <div className={styles.escalationDesc}>{step.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SafetyScenarioFlow;
