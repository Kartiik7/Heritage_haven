import React, { useState } from "react";

export default function SignupCard({ switchToLogin, onSuccess }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", form);
    onSuccess(); // ✅ go to HomePage
  };

  return (
    <div className="login-card">
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Username</label>
        <input className="input" name="username" type="text" value={form.username} onChange={handleChange} required />

        <label>Enter Password</label>
        <input className="input" name="password" type="password" value={form.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input className="input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />

        <div className="row between center">
          <button className="text-btn" type="button" onClick={switchToLogin}>
            Log In if already have an account
          </button>
          <label className="remember">
            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
            Remember Me
          </label>
        </div>

        <div className="signup-wrap">
          <button className="signup-btn" type="submit">SignUp</button>
        </div>
      </form>
    </div>
  );
}