import React, { useState } from "react";
import axios from "axios";

const QuoteForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });
  const [status, setStatus] = useState({ success: false, error: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    // Simple example, expand as needed
    if (!form.name || !form.email || !form.phone) return false;
    return true;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatus({ success: false, error: "Please fill all required fields." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ success: false, error: "" });

    try {
      await axios.post("/api/send-quote", form);  // adjust if your backend runs elsewhere

      setStatus({ success: true, error: "" });
      setForm({
        name: "", email: "", phone: "",
        projectType: "", budget: "",
        timeline: "", message: ""
      });
      // Success message, then redirect after short delay
      setTimeout(() => { window.location.href = "/"; }, 1800);

    } catch (error) {
      setStatus({ success: false, error: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required /><br />
      <input name="projectType" placeholder="Project Type" value={form.projectType} onChange={handleChange} /><br />
      <input name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} /><br />
      <input name="timeline" placeholder="Timeline" value={form.timeline} onChange={handleChange} /><br />
      <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} /><br />
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Request Quote"}</button>
      {status.success && <div style={{ color: "green" }}>Success! Redirecting...</div>}
      {status.error && <div style={{ color: "red" }}>{status.error}</div>}
    </form>
  );
};

export default QuoteForm;
