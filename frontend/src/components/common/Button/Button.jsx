import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary", // primary, secondary, outlined, inverted, accent, danger, ghost
  size = "md", // sm, md, lg
  shape = "rounded", // rounded, pill, square
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`] || styles.sizeMd;
  const shapeClass = styles[shape] || styles.rounded;
  const widthClass = fullWidth ? styles.fullWidth : "";

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${shapeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
    </button>
  );
};

export default Button;
