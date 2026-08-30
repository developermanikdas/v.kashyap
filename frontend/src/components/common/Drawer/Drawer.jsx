import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./Drawer.module.css";

const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerAction,
  children,
  footer,
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.drawer} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={`${styles.header} ${!title && !subtitle ? styles.headerMinimal : ""}`}>
          {(title || subtitle) && (
            <div className={styles.titleArea}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
          )}
          <div className={`${styles.actionsArea} ${!title && !subtitle ? styles.actionsAreaFull : ""}`}>
            {headerAction}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close drawer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Drawer;
