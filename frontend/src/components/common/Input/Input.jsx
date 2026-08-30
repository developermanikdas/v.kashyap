import styles from "./Input.module.css";

const Input = ({
  label,
  variant = "underline", // underline, boxed, search
  icon: IconLeft,
  iconRight: IconRight,
  onIconRightClick,
  error,
  className = "",
  containerClassName = "",
  id,
  type = "text",
  ...props
}) => {
  const variantClass = styles[variant] || styles.underline;

  return (
    <div className={`${styles.wrapper} ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {IconLeft && (
          <span className={styles.iconLeft}>
            <IconLeft size={16} />
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`${styles.input} ${variantClass} ${className}`}
          {...props}
        />
        {IconRight && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={onIconRightClick}
            tabIndex={-1}
          >
            <IconRight size={16} />
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
