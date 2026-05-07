import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const initialState = {
  name: "",
  email: "",
  password: "",
};

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }

      navigate("/");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="hero-panel">
        <p className="eyebrow">MERN Assignment</p>
        <h1>Track the top Hacker News stories in one place.</h1>
        <p>
          Sign in to bookmark stories, keep your list synced with the backend, and revisit
          the most interesting links later.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Create account" : "Welcome back"}</h2>

        {isRegister ? (
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
        ) : null}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </section>
  );
}

export default AuthPage;

