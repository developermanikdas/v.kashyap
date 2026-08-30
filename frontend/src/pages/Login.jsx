import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/auth.service.js";
import { useAuth } from "../hooks/useAuth";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("archive_remember_user");
      if (savedUser) {
        setFormData((prev) => ({ ...prev, identifier: savedUser }));
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const data = await loginUser(formData);

      if (rememberMe) {
        localStorage.setItem("archive_remember_user", formData.identifier);
      } else {
        localStorage.removeItem("archive_remember_user");
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Left - Serene Vector Illustration */}
        <div className={styles.illustrationArea}>
          <img
            src="/login.svg"
            alt="Serenity Yoga Illustration"
            style={{ width: "100%", maxWidth: "420px", height: "auto", display: "block" }}
          />
        </div>

        {/* Right - Editorial Form */}
        <div className={styles.formArea}>
          <div className={styles.header}>
            <h1 className={styles.title}>Serenity</h1>
            <div className={styles.divider} />
            <p className={styles.subtitle}>Let&apos;s Sign In</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="identifier" className={styles.label}>
                USER NAME
              </label>
              <input
                id="identifier"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="username"
                className={styles.input}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                PASSWORD
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
