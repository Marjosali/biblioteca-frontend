import React, { useEffect, useState } from "react";
import "./assets/styles.css";
import VLibras from "@djpfs/react-vlibras";

import { useAuth } from "./context/AuthContext";
import { getBooks, getUsers, getLoans } from "./Api";
import { USER_ROLES } from "./constants/userRoles";

import BookList from "./components/BookList";
import AdminPanel from "./components/AdminPanel";
import LoginForm from "./components/LoginForm";

const Loader = () => <p>Carregando sistema...</p>;

export default function App() {
  const { user, role, loading, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("livros");

  const isSuperUser = role === USER_ROLES.SUPERUSER;

  // 🔍 Controles de zoom
  const setZoom = (size) => {
    document.body.classList.remove("zoom-small", "zoom-medium", "zoom-large");
    document.body.classList.add(size);
  };

  // 🔹 Buscar livros
  async function fetchBooks() {
    try {
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao carregar livros");
    }
  }

  // 🔹 Buscar usuários
  async function fetchUsers() {
    if (!isSuperUser) return;
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao carregar usuários");
    }
  }

  // 🔹 Buscar empréstimos
  async function fetchLoans() {
    if (!isSuperUser) return;
    try {
      await getLoans();
    } catch (err) {
      console.error("Erro ao carregar empréstimos");
    }
  }

  // 🔹 Carregar dados quando usuário loga
  useEffect(() => {
    if (user) {
      fetchBooks();
      if (isSuperUser) {
        fetchUsers();
        fetchLoans();
      }
    }
  }, [user, role]);

  if (loading) return <Loader />;

  return (
    <div className="app-container">
      {/* 🔹 Cabeçalho */}
      <header className="app-header">
        <h1>📚 Sala de Leitura Online Acessível</h1>

        {user ? (
          <div className="user-info">
            <p>
              Bem-vindo, <strong>{user.username}</strong> (
              {isSuperUser
                ? "Superusuário"
                : role === USER_ROLES.ADMIN
                ? "Administrador"
                : "Usuário"}
              )
            </p>
            <button onClick={logout}>Sair</button>
          </div>
        ) : (
          <LoginForm />
        )}

        {/* 🔹 Acessibilidade: Zoom + Contraste */}
        {user && (
          <div
            className="accessibility-controls"
            style={{
              marginTop: "1rem",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <button onClick={() => setZoom("zoom-small")}>🔍-</button>
            <button onClick={() => setZoom("zoom-medium")}>🔍</button>
            <button onClick={() => setZoom("zoom-large")}>🔍+</button>

            <button
              onClick={() =>
                document.body.classList.toggle("dark-mode")
              }
            >
              🎨 Contraste
            </button>
          </div>
        )}
      </header>

      {/* 🔹 Navegação por abas */}
      {user && (
        <div className="tab-navigation">
          <button
            className={activeTab === "livros" ? "active-tab" : ""}
            onClick={() => setActiveTab("livros")}
          >
            📚 Livros
          </button>

          {isSuperUser && (
            <button
              className={activeTab === "admin" ? "active-tab" : ""}
              onClick={() => setActiveTab("admin")}
            >
              ⚙️ Administração
            </button>
          )}
        </div>
      )}

      {/* 🔹 Conteúdo principal */}
      <main>
        {activeTab === "livros" && (
          <BookList books={books} refreshBooks={fetchBooks} />
        )}

        {activeTab === "admin" && isSuperUser && (
          <AdminPanel
            role={role}
            books={books}
            users={users}
            fetchBooks={fetchBooks}
            fetchUsers={fetchUsers}
            fetchLoans={fetchLoans}
          />
        )}
      </main>

      {/* 🔹 Rodapé */}
      <footer className="app-footer">
        <p>
          Desenvolvido com acessibilidade total — Libras, teclado, contraste e
          zoom.
        </p>
      </footer>

      {/* 🟦 VLibras carregado corretamente */}
      <VLibras />
    </div>
  );
}