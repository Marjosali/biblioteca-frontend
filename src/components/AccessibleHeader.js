// src/components/AccessibleHeader.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function AccessibleHeader({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="accessible-header" role="banner" aria-label="Cabeçalho principal">
      <div className="header-content">
        <h1 tabIndex="0">📚 Sistema de Biblioteca Acessível</h1>

        {user ? (
          <nav role="navigation" aria-label="Menu principal">
            <ul className="nav-list">
              <li>
                <button onClick={() => navigate("/books")}>📖 Livros</button>
              </li>

              {/* 🔹 Somente administradores e superusuários */}
              {(user.is_staff || user.is_superuser || user.is_admin) && (
                <>
                  <li>
                    <button onClick={() => navigate("/users")}>👥 Usuários</button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/loans")}>📚 Empréstimos</button>
                  </li>
                  <li>
                    <button
                      onClick={() => window.open("http://127.0.0.1:8000/admin/", "_blank")}
                    >
                      ⚙️ Administração Django
                    </button>
                  </li>
                </>
              )}

              <li>
                <button onClick={handleLogout}>🚪 Sair ({user.username})</button>
              </li>
            </ul>
          </nav>
        ) : (
          <button onClick={() => navigate("/login")}>Entrar</button>
        )}
      </div>
    </header>
  );
}
