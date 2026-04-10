import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Trash2, Mail, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { supabase } from "../../lib/supabaseClient";

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [name, setName] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Security State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [securityMessage, setSecurityMessage] = useState({ type: "", text: "" });

  // Support State
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [supportMessage, setSupportMessage] = useState({ type: "", text: "" });

  // Danger State
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deletionRequestedAt = user?.user_metadata?.deletion_requested_at;
  const isDeletionPending = !!deletionRequestedAt;

  useEffect(() => {
    if (user && isOpen) {
      setName(user.user_metadata?.full_name || user.name || "");
      // Reset states
      setProfileMessage({ type: "", text: "" });
      setSecurityMessage({ type: "", text: "" });
      setSupportMessage({ type: "", text: "" });
      setPassword("");
      setConfirmPassword("");
      setMessage("");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: "", text: "" });
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });
      if (error) throw error;
      setProfileMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMessage({ type: "error", text: err.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSecurityMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setSecurityMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    
    setIsUpdatingPassword(true);
    setSecurityMessage({ type: "", text: "" });
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      setSecurityMessage({ type: "success", text: "Password updated successfully." });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSecurityMessage({ type: "error", text: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleContactAdmin = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSendingMessage(true);
    setSupportMessage({ type: "", text: "" });
    
    try {
      const { error } = await supabase.from('contact_messages').insert({
        user_id: user.id,
        email: user.email,
        message: message,
        created_at: new Date().toISOString()
      });
      
      if (error) throw error;
      setSupportMessage({ type: "success", text: "Message sent to admin successfully." });
      setMessage("");
    } catch (err) {
      // Provide helpful error if table doesn't exist
      if (err.code === '42P01') {
        setSupportMessage({ type: "error", text: "Database table 'contact_messages' not configured. Please contact support." });
      } else {
        setSupportMessage({ type: "error", text: err.message });
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  const toggleDeletionRequest = async () => {
    setIsDeleting(true);
    try {
      const newTimestamp = isDeletionPending ? null : new Date().toISOString();
      const { error } = await supabase.auth.updateUser({
        data: { deletion_requested_at: newTimestamp }
      });
      if (error) throw error;
      
      // Auto-reload window to reflect metadata states if necessary, or just rely on the auth listener
      window.location.reload(); 
    } catch (err) {
      alert("Failed to update deletion status: " + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          cursor: "pointer"
        }}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "rgba(28, 28, 30, 0.8)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.8)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 1
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Account Settings</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>Manage your preferences and security</p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-secondary)",
              width: "36px", height: "36px", borderRadius: "50%", display: "flex", 
              alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "row", minHeight: "360px" }}>
          {/* Sidebar Tabs */}
          <div style={{ 
            width: "160px", 
            borderRight: "1px solid rgba(255,255,255,0.08)", 
            padding: "1rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem"
          }}>
            <TabItem active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={User} label="Profile" />
            <TabItem active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Lock} label="Security" />
            <TabItem active={activeTab === "support"} onClick={() => setActiveTab("support")} icon={Mail} label="Support" />
            <TabItem active={activeTab === "danger"} onClick={() => setActiveTab("danger")} icon={AlertTriangle} label="Danger Zone" danger />
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: "1.5rem", background: "rgba(0,0,0,0.2)" }}>
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Public Profile</h3>
                
                {profileMessage.text && (
                  <MessageBanner type={profileMessage.type} text={profileMessage.text} />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={inputStyle} 
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email} 
                    disabled 
                    style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} 
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Email cannot be changed directly.</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  style={primaryButtonStyle}
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Update Password</h3>
                
                {securityMessage.text && (
                  <MessageBanner type={securityMessage.type} text={securityMessage.text} />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>New Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={inputStyle} 
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    style={inputStyle} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isUpdatingPassword || !password}
                  style={{ ...primaryButtonStyle, opacity: !password ? 0.5 : 1 }}
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            {/* SUPPORT TAB */}
            {activeTab === "support" && (
              <form onSubmit={handleContactAdmin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Contact Admin</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  Send a message directly to the database for support.
                </p>
                
                {supportMessage.text && (
                  <MessageBanner type={supportMessage.type} text={supportMessage.text} />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    style={{ ...inputStyle, resize: "none" }} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSendingMessage || !message.trim()}
                  style={{ ...primaryButtonStyle, opacity: !message.trim() ? 0.5 : 1 }}
                >
                  {isSendingMessage ? "Sending..." : "Submit Ticket"}
                </button>
              </form>
            )}

            {/* DANGER ZONE TAB */}
            {activeTab === "danger" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "var(--error)" }}>Danger Zone</h3>
                
                {!isDeletionPending ? (
                  <div style={{ background: "rgba(255, 69, 58, 0.1)", border: "1px solid rgba(255, 69, 58, 0.2)", borderRadius: "12px", padding: "1rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--error)", fontSize: "0.95rem" }}>Request Account Deletion</h4>
                    <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      Clicking the button below will flag your account for deletion. A 24-hour timer will begin. If not cancelled, your data will be permanently wiped from the database.
                    </p>
                    <button 
                      onClick={toggleDeletionRequest}
                      disabled={isDeleting}
                      style={{
                        background: "var(--error)", color: "white", border: "none", padding: "0.6rem 1rem",
                        borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                        transition: "background 0.2s"
                       }}
                       onMouseOver={(e) => e.currentTarget.style.background = "#d73930"}
                       onMouseOut={(e) => e.currentTarget.style.background = "var(--error)"}
                    >
                      {isDeleting ? "Processing..." : "Start Deletion Process"}
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "rgba(255, 159, 10, 0.1)", border: "1px solid rgba(255, 159, 10, 0.2)", borderRadius: "12px", padding: "1rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--warning)", fontSize: "0.95rem" }}>Deletion Pending</h4>
                    <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      Your account is scheduled for deletion on {new Date(new Date(deletionRequestedAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString()}.
                    </p>
                    <button 
                      onClick={toggleDeletionRequest}
                      disabled={isDeleting}
                      style={{
                        background: "var(--warning)", color: "black", border: "none", padding: "0.6rem 1rem",
                        borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", gap: "0.4rem", alignItems: "center"
                       }}
                    >
                      <RefreshCcw size={16} /> {isDeleting ? "Processing..." : "Undo Deletion"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Helper Components & Styles */

const TabItem = ({ active, onClick, icon: Icon, label, danger }) => (
  <div 
    onClick={onClick}
    style={{
      padding: "0.75rem 1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      cursor: "pointer",
      color: active ? (danger ? "var(--error)" : "white") : "var(--text-secondary)",
      background: active ? (danger ? "rgba(255, 69, 58, 0.1)" : "rgba(255, 255, 255, 0.05)") : "transparent",
      fontWeight: active ? 600 : 500,
      fontSize: "0.9rem",
      borderLeft: `3px solid ${active ? (danger ? "var(--error)" : "var(--accent-blue)") : "transparent"}`,
      transition: "all 0.2s"
    }}
    onMouseOver={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
        e.currentTarget.style.color = danger ? "var(--error)" : "white";
      }
    }}
    onMouseOut={(e) => {
      if (!active) {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-secondary)";
      }
    }}
  >
    <Icon size={16} />
    {label}
  </div>
);

const MessageBanner = ({ type, text }) => {
  const isError = type === "error";
  return (
    <div style={{
      padding: "0.75rem",
      background: isError ? "rgba(255,69,58,0.1)" : "rgba(48,209,88,0.1)",
      border: `1px solid ${isError ? "rgba(255,69,58,0.2)" : "rgba(48,209,88,0.2)"}`,
      borderRadius: "8px",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.5rem",
      color: isError ? "var(--error)" : "var(--success)",
      fontSize: "0.85rem"
    }}>
      {isError ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} /> : <CheckCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />}
      {text}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "0.75rem",
  borderRadius: "10px",
  color: "white",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit"
};

const primaryButtonStyle = {
  background: "white",
  color: "black",
  border: "none",
  padding: "0.85rem",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
  marginTop: "0.5rem",
  fontFamily: "inherit"
};
