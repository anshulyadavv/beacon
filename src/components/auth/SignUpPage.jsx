import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Mail, Lock, User, ChevronRight, X, AlertTriangle } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signup, hasValidSupabase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasValidSupabase) {
      setError("Authentication is currently disabled due to missing keys.");
      return;
    }
    
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      await signup(email, password, name);
      // Depending on Supabase settings, email confirmation might be required.
      // But typically with auto-confirm this signs them in automatically.
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "var(--bg-deep)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Glow */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(94, 92, 230, 0.1) 0%, transparent 70%)",
        filter: "blur(100px)",
        zIndex: 0
      }} />

      {/* Close Button */}
      <button 
        onClick={() => navigate("/")}
        aria-label="Return to landing page"
        style={{
          position: "absolute",
          top: "2.5rem",
          right: "2.5rem",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.6)",
          cursor: "pointer",
          zIndex: 10,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "rotate(90deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.transform = "rotate(0deg)";
        }}
      >
        <X size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "3rem 2.5rem",
          borderRadius: "32px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          background: "rgba(28, 28, 30, 0.6)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <Activity size={32} color="var(--accent-blue)" />
          <span style={{ color: "white", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.5px" }}>BEACON</span>
        </Link>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>Create Your Account</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
          Join Beacon to start tracking your portfolio with professional tools.
        </p>

        {!hasValidSupabase && (
          <div style={{ background: "rgba(255, 159, 10, 0.1)", border: "1px solid rgba(255, 159, 10, 0.2)", padding: "10px", borderRadius: "10px", color: "var(--warning)", fontSize: "0.85rem", marginBottom: "1rem", display: "flex", gap: "8px", alignItems: "flex-start", textAlign: "left" }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>Missing Supabase API Keys. Please provide valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file to enable registration.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div style={{ color: "var(--error)", fontSize: "0.85rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div style={{ position: "relative" }}>
            <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#86868b" }} />
            <input
              type="text"
              placeholder="Full Name"
              required
              disabled={!hasValidSupabase}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0.85rem 1rem 0.85rem 3rem",
                borderRadius: "14px",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                opacity: !hasValidSupabase ? 0.5 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#86868b" }} />
            <input
              type="email"
              placeholder="Email"
              required
              disabled={!hasValidSupabase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0.85rem 1rem 0.85rem 3rem",
                borderRadius: "14px",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                opacity: !hasValidSupabase ? 0.5 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#86868b" }} />
            <input
              type="password"
              placeholder="Password"
              required
              disabled={!hasValidSupabase}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0.85rem 1rem 0.85rem 3rem",
                borderRadius: "14px",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                opacity: !hasValidSupabase ? 0.5 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#86868b" }} />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              disabled={!hasValidSupabase}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0.85rem 1rem 0.85rem 3rem",
                borderRadius: "14px",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                opacity: !hasValidSupabase ? 0.5 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <motion.button
            whileHover={hasValidSupabase && !loading ? { scale: 1.02 } : {}}
            whileTap={hasValidSupabase && !loading ? { scale: 0.98 } : {}}
            disabled={loading || !hasValidSupabase}
            style={{
              background: "white",
              color: "black",
              padding: "0.85rem",
              borderRadius: "14px",
              fontSize: "1rem",
              fontWeight: 600,
              border: "none",
              cursor: (!hasValidSupabase || loading) ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              opacity: (!hasValidSupabase || loading) ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : <>Sign Up <ChevronRight size={18} /></>}
          </motion.button>
        </form>

        <p style={{ marginTop: "2.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
