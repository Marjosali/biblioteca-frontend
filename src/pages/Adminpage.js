import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "./BookForm";
import UserForm from "./UserForm";
import LoanForm from "./LoanForm";
import { getCurrentUser } from "../services/api";
import "../assets/styles.css";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("books");
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.isAdmin) {
          navigate("/"); // redireciona se não for admin
        } else {
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Erro ao obter usuário:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [navigate]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "books":
        return <BookForm onSave={handleRefresh} key={`books-${refreshKey}`} />;
      case "users":
        return <UserForm onSave={handleRefresh} key={`users-${refreshKey}`} />;
      case "loans":
        return <LoanForm onSave={handleRefresh} key={`loans-${refreshKey}`} isAdmin />;
      default:
        return <BookForm onSave={handleRefresh} key={`books-${refreshKey}`} />;
    }
  };

  const activeTabTitle =
    activeTab === "books"
      ? "Gerenciar Livros"
      : activeTab === "users"
      ? "Gerenciar Usuários"
      : "Gerenciar Empréstimos";

  return (
    <main className="admin-container" role="main" aria-label="Painel Administrativo">
      <header className="admin-header">
        <h1 tabIndex="0">🛠 Painel Administrativo</h1>
        <p tabIndex="0">Bem-vindo, {user.username}! Gerencie livros, usuários e empréstimos.</p>
      </header>

      <nav className="tab-navigation" aria-label="Navegação de abas">
        <button
          className={activeTab === "books" ? "active-tab" : ""}
          onClick={() => setActiveTab("books")}
          aria-label="Gerenciar livros"
          aria-current={activeTab === "books" ? "page" : undefined}
        >
          📘 Livros
        </button>
        <button
          className={activeTab === "users" ? "active-tab" : ""}
          onClick={() => setActiveTab("users")}
          aria-label="Gerenciar usuários"
          aria-current={activeTab === "users" ? "page" : undefined}
        >
          👤 Usuários
        </button>
        <button
          className={activeTab === "loans" ? "active-tab" : ""}
          onClick={() => setActiveTab("loans")}
          aria-label="Gerenciar empréstimos"
          aria-current={activeTab === "loans" ? "page" : undefined}
        >
          📚 Empréstimos
        </button>
      </nav>

      <h2 tabIndex="0" aria-live="polite">
        {activeTabTitle}
      </h2>

      <section className="tab-content">{renderTab()}</section>

      <footer className="admin-footer" tabIndex="0">
        <small>Desenvolvido com foco em acessibilidade e inclusão digital. ♿</small>
      </footer>
    </main>
  );
}
