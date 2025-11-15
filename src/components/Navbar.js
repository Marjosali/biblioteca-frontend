// src/components/Navbar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onLogin, onLogout, user }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username, password);
      setUsername("");
      setPassword("");
    } else {
      alert("Preencha usuário e senha para continuar.");
    }
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="Barra de navegação principal"
      style={{
        background: "#004999",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
      }}
    >
      {/* Título acessível */}
      <h1
        tabIndex="0"
        style={{
          fontSize: "1.5rem",
          margin: 0,
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        📚 Biblioteca Online
      </h1>

      {user ? (
        <div
          className="navbar-user"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <span
            tabIndex="0"
            aria-label={`Usuário logado: ${user.username}`}
          >
            👤 {user.username}
          </span>

          {/* Links rápidos de admin/superuser */}
          {(user.is_staff || user.is_superuser) && (
            <div
              className="admin-links"
              role="navigation"
              aria-label="Links rápidos de administração"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <button
                onClick={() => navigate("/admin/books")}
                aria-label="Cadastro de livros"
                style={buttonStyle}
              >
                📘 Livros
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                aria-label="Cadastro de usuários"
                style={buttonStyle}
              >
                👥 Usuários
              </button>
              <button
                onClick={() => navigate("/admin/loans")}
                aria-label="Gerenciar empréstimos"
                style={buttonStyle}
              >
                📄 Empréstimos
              </button>
            </div>
          )}

          <button
            onClick={onLogout}
            aria-label="Sair da conta"
            style={{
              background: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
            onFocus={(e) => (e.target.style.background = "#c9302c")}
            onBlur={(e) => (e.target.style.background = "#d9534f")}
            onMouseEnter={(e) => (e.target.style.background = "#c9302c")}
            onMouseLeave={(e) => (e.target.style.background = "#d9534f")}
          >
            Sair
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleLogin}
          aria-label="Formulário de login rápido"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <label htmlFor="nav-username" className="sr-only">
            Usuário
          </label>
          <input
            id="nav-username"
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
            autoComplete="username"
            style={{
              padding: "0.4rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <label htmlFor="nav-password" className="sr-only">
            Senha
          </label>
          <input
            id="nav-password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            autoComplete="current-password"
            style={{
              padding: "0.4rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              background: "#00bfff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.45rem 1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onFocus={(e) => (e.target.style.background = "#0099cc")}
            onBlur={(e) => (e.target.style.background = "#00bfff")}
            onMouseEnter={(e) => (e.target.style.background = "#0099cc")}
            onMouseLeave={(e) => (e.target.style.background = "#00bfff")}
          >
            Entrar
          </button>
        </form>
      )}
    </nav>
  );
}

// Estilo compartilhado dos botões admin
const buttonStyle = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "0.4rem 0.8rem",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.3s",
};
