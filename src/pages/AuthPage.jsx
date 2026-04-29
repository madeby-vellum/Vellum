import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import Field from "../components/Field.jsx";
import { Logo } from "./HomePage.jsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      setLoading(false);
      if (authError) return setError(authError.message);

    } else {
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

    navigate("/shelf");
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"var(--cloud)" }}>
      <div className="fu" style={{ width:380, maxWidth:"100%" }}>

        {/* Logo */}
        <div style={{ marginBottom:44, textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            {/* <Logo size={48} /> */}
            <img src="/logo/periwinkle-small.png" alt="Vellum" style={{ height:60, width:"auto", display:"block" }} />
          </div>
          <div className="cg" style={{ fontSize:56, fontWeight:300, color:"var(--periwinkle)", textTransform:"uppercase" }}>
            Vellum
          </div>
          <div style={{ fontSize:10, color:"var(--periwinkle)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:8 }}>
            your private journal
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit}
          style={{ background:"var(--cloud)", padding:"44px 40px", boxShadow:"0 1px 32px rgba(55,67,117,0.08)", border:"1px solid rgba(186,189,226,0.25)" }}>

          {/* Tabs */}
          <div style={{ display:"flex", marginBottom:28, borderBottom:"1px solid rgba(186,189,226,0.25)" }}>
            {["login", "signup"].map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex:1, padding:"10px 0", fontSize:10, letterSpacing:"0.12em",
                  textTransform:"uppercase", background:"none", border:"none",
                  borderBottom: mode===m ? "1.5px solid var(--periwinkle)" : "1.5px solid transparent",
                  marginBottom:-1,
                  color: mode===m ? "var(--periwinkle)" : "rgba(186,189,226,0.5)",
                  cursor:"pointer"
                }}>
                {m}
              </button>
            ))}
          </div>

          {/* Fields */}
          {mode === "signup" && (
            <Field label="Username" placeholder=""
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          )}

          <Field label="Email" type="email" placeholder=""
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <Field label="Password" type="password" placeholder=""
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />

          {error && (
            <div style={{ color:"var(--navy)", fontSize:11, marginBottom:14 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width:"100%", padding:"13px", background:"var(--periwinkle)",
              color:"var(--navy)", border:"none", fontSize:11,
              letterSpacing:"0.12em", textTransform:"uppercase",
              marginTop:8, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}>
            {loading
              ? (mode === "login" ? "Signing in…" : "Creating account…")
              : (mode === "login" ? "Sign in" : "Create account")}
          </button>
        </form>
      </div>
    </div>
  );
}