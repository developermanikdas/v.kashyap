import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { label: "Home", path: "/" },
    { label: "Safety Hub", path: "/safety-hub" },
    { label: "Stories", path: "/stories" },
    { label: "Acknowledgement", path: "/acknowledgement" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand} onClick={() => navigate("/")}>
          <span className={styles.brandText}>The Many Strings</span>
        </div>

        {/* Nav Links (Desktop + Mobile Dropdown) */}
        <ul
          className={`${styles.navLinks} ${
            mobileMenuOpen ? styles.navLinksOpen : ""
          }`}
        >
          {mainNavItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                }
                onClick={handleNavClick}
                end={item.path === "/"}
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Profile option in mobile dropdown list */}
          <li className={`${styles.navItem} ${styles.mobileOnly}`}>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ""}`
              }
              onClick={handleNavClick}
            >
              Profile
            </NavLink>
          </li>
        </ul>

        {/* Right Actions: Profile Icon & Hamburger Button Together */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.profileBtn}
            onClick={() => navigate("/profile")}
            title="User Profile"
            aria-label="Profile"
          >
            <User size={16} />
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
