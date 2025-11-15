import React, { useState, useRef } from "react";
import "../assets/styles.css";
import { useAuth } from "../context/AuthContext"; // ✅ usando AuthContext

export default function LoginForm() {
  const { login } = useAuth(); // 🔹 função unificada de login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password); // 🔥 Chama login() do AuthContext

      // limpar campos
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Erro no login:", err);

      if (err?.response?.status === 401) {
        setError("❌ Usuário ou senha incorretos.");
      } else {
        setError("❌ Erro ao conectar ao servidor.");
      }

      setTimeout(() => errorRef.current?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="login-section"
      aria-label="Área de login do sistema"
      style={{
        maxWidth: "400px",
        margin: "3rem auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        tabIndex="0"
        style={{
          textAlign: "center",
          color: "#003366",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        🔐 Login do Sistema
      </h2>

      {error && (
        <div
          role="alert"
          ref={errorRef}
          tabIndex="-1"
          className="error-msg"
          aria-live="assertive"
          style={{
            background: "#fdd",
            color: "#900",
            padding: "0.8rem",
            margin: "1rem 0",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        aria-label="Formulário de login"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label htmlFor="username" className="font-semibold">
          Usuário:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          disabled={loading}
          style={{
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <label htmlFor="password" className="font-semibold">
          Senha:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
          style={{
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          aria-label="Entrar no sistema"
          style={{
            padding: "0.75rem",
            background: loading ? "#999" : "#004999",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
