import React, { useState } from "react";

export default function LoginCard({ switchToSignup, onSuccess }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", form);
    onSuccess(); // ✅ go to HomePage
  };

  return (
    <div className="login-card">
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Username</label>
        <input className="input" name="username" type="text" value={form.username} onChange={handleChange} required />

        <label>Password</label>
        <input className="input" name="password" type="password" value={form.password} onChange={handleChange} required />

        <div className="row between center">
          <button className="text-btn" type="button" onClick={switchToSignup}>
            SignUp / Create Account
          </button>
          <label className="remember">
            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
            Remember Me
          </label>
        </div>

        <div className="signup-wrap">
          <button className="signup-btn" type="submit">Log In</button>
        </div>
      </form>
    </div>
  );
}