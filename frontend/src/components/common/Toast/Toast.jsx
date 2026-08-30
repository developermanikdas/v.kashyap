import { useState, useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

const Toast = ({ message, type = "success", duration = 3500, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${styles[type] || styles.success}`}>
        {type === "success" && <CheckCircle2 size={18} color="#22c55e" />}
        {type === "info" && <Info size={18} color="#3b82f6" />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
