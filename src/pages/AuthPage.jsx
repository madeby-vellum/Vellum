import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import Field from "../components/Field.jsx";
import "./AuthPage.css";

export default function AuthPage() {

  const navigate = useNavigate();

  // Auth state from global context
  const { user } = useContext(AuthContext);

  // login vs signup mode toggle
  const [mode, setMode] = useState("login"); // "login" | "signup"

  // form state for all inputs
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // UI error state
  const [error, setError] = useState("");

  // loading state during auth requests
  const [loading, setLoading] = useState(false);

  // Redirect user if already logged in
  useEffect(() => {
    if (user) {
      navigate("/shelf", { replace: true });
    }
  }, [user, navigate]);

  // Handles both login and signup submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    // basic validation
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    // LOGIN FLOW
    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      setLoading(false);
      if (authError) return setError(authError.message);

    // SIGNUP FLOW
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.name }, // stored in user metadata
        },
      });

      setLoading(false);
      if (authError) return setError(authError.message);
    }

    // redirect after successful auth
    navigate("/shelf");
  };

  return (
    <div className="auth-page">

      <div className={`fu auth-container`}>

        {/* Branding section */}
        <div className="auth-logo-wrapper">

          <div className="auth-logo-image-wrapper">
            <img
              src="/logo/periwinkle-small.png"
              alt="Vellum"
              className="auth-logo-image"
            />
          </div>

          <div className={`cg auth-logo-title`}>
            Vellum
          </div>

          <div className="auth-logo-subtitle">
            your private journal
          </div>

        </div>

        {/* Auth form card */}
        <form onSubmit={handleSubmit} className="auth-card">

          {/* Login / Signup tabs */}
          <div className="auth-tabs">
            {["login", "signup"].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(""); }}
                className={`auth-tab${mode === m ? " auth-tab--active" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Username field only for signup */}
          {mode === "signup" && (
            <Field
              label="Username"
              placeholder=""
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          )}

          {/* Email input */}
          <Field
            label="Email"
            type="email"
            placeholder=""
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          {/* Password input */}
          <Field
            label="Password"
            type="password"
            placeholder=""
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />

          {/* Error message display */}
          {error && (
            <div className="auth-error">{error}</div>
          )}

          {/* Submit button with loading state */}
          <button type="submit" disabled={loading} className="auth-submit">
            {loading
              ? (mode === "login" ? "Signing in…" : "Creating account…")
              : (mode === "login" ? "Sign in" : "Create account")}
          </button>

        </form>
      </div>
    </div>
  );
}