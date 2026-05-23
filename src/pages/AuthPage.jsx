import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import Field from "../components/Field.jsx";
import "./AuthPage.css";

// render login/signup form
export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // states
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in
  useEffect(() => {
    if (user) {
      navigate("/shelf", { replace: true });
    }
  }, [user, navigate]);

  // submit form
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    // if fields are empty, show error
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    // login with supabase
    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      setLoading(false);
      if (authError) return setError(authError.message);

    } 
    // signup with supabase
    else {
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.name },
        },
      });

      setLoading(false);
      if (authError) return setError(authError.message);
    }

    // on success, navigate to shelf
    navigate("/shelf");
  };

  return (
    <div className="auth-page">
      <div className={`fu auth-container`}>

        {/* Logo */}
        <div className="auth-logo-wrapper">
          <div className="auth-logo-image-wrapper">
            <img src="/logo/periwinkle-small.png" alt="Vellum" className="auth-logo-image" />
          </div>
          <div className={`cg auth-logo-title`}>
            Vellum
          </div>
          <div className="auth-logo-subtitle">
            your private journal
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="auth-card">

          {/* Tabs */}
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

          {/* Fields */}
          {mode === "signup" && (
            // only show username field in signup mode
            <Field label="Username" placeholder=""
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          )}

          {/* Email Field */}
          <Field label="Email" type="email" placeholder=""
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          {/* Password Field */}
          <Field label="Password" type="password" placeholder=""
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />

          {/* Error Message */}
          {error && (
            <div className="auth-error">{error}</div>
          )}

          {/* Submit Button */}
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