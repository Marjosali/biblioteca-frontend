import React, { useState, useEffect } from "react";
import BookForm from "./BookForm";
import UserForm from "./UserForm";
import BookList from "./BookList";
import LoanComponents from "./LoanComponents";
import "../assets/styles.css";

/**
 * Painel administrativo da Biblioteca
 */
export default function AdminPanel({
  role,
  books = [],
  users = [],
  fetchBooks,
  fetchUsers,
  fetchLoans,
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cadastro");

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchBooks(), fetchUsers(), fetchLoans()]);
    setLoading(false);
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="admin-panel" role="main" aria-label="Painel Administrativo">
      <header className="admin-header">
        <h1 tabIndex="0">⚙️ Painel de Administração</h1>

        {(role === "superuser" || role === "admin") && (
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-link"
          >
            ⚙️ Acessar Django Admin
          </a>
        )}
      </header>

      {loading && (
        <p aria-live="polite" tabIndex="0">
          ⏳ Atualizando dados do servidor...
        </p>
      )}

      {/* 🔹 Navegação por Abas */}
      <div className="admin-tabs">
        <button
          className={activeTab === "cadastro" ? "active" : ""}
          onClick={() => setActiveTab("cadastro")}
        >
          📝 Cadastros
        </button>

        <button
          className={activeTab === "livros" ? "active" : ""}
          onClick={() => setActiveTab("livros")}
        >
          📚 Livros
        </button>

        <button
          className={activeTab === "usuarios" ? "active" : ""}
          onClick={() => setActiveTab("usuarios")}
        >
          👤 Usuários
        </button>

        <button
          className={activeTab === "emprestimos" ? "active" : ""}
          onClick={() => setActiveTab("emprestimos")}
        >
          🔄 Empréstimos
        </button>
      </div>

      <hr />

      {/* 🔹 Conteúdo das abas */}
      <div className="admin-tab-content">
        
        {/* ==========================================
            ABA: CADASTROS (SEM CADASTRO DE EMPRÉSTIMO)
        ========================================== */}
        {activeTab === "cadastro" && (
          <div className="admin-top-panels">
            
            <section className="admin-section" aria-label="Cadastro de livros">
              <h2 tabIndex="0">📘 Cadastrar Livros</h2>
              <BookForm onSave={handleRefresh} key={`book-${refreshKey}`} />
            </section>

            <section className="admin-section" aria-label="Cadastro de usuários">
              <h2 tabIndex="0">👤 Cadastrar Usuários</h2>
              <UserForm onSave={handleRefresh} key={`user-${refreshKey}`} />
            </section>
          </div>
        )}

        {/* ========================================== */}
        {activeTab === "livros" && (
          <section aria-label="Lista de livros cadastrados">
            <h3 tabIndex="0">📚 Livros Registrados</h3>

            {books.length ? (
              <BookList
                books={books}
                refreshBooks={fetchBooks}
                key={`list-${refreshKey}`}
                isLoggedIn={true}
              />
            ) : (
              <p tabIndex="0">Nenhum livro cadastrado no momento.</p>
            )}
          </section>
        )}

        {/* ========================================== */}
        {activeTab === "usuarios" && (
          <section aria-label="Lista de usuários cadastrados">
            <h3 tabIndex="0">👥 Usuários Cadastrados</h3>

            {users.length ? (
              <ul className="user-list">
                {users.map((u) => (
                  <li key={u.id} tabIndex="0">
                    <strong>{u.username}</strong> ({u.email}) —{" "}
                    {u.is_superuser
                      ? "⭐ Superusuário"
                      : u.is_staff
                      ? "👔 Administrador"
                      : "👤 Usuário comum"}
                  </li>
                ))}
              </ul>
            ) : (
              <p tabIndex="0">Nenhum usuário encontrado.</p>
            )}
          </section>
        )}

        {/* ========================================== */}
        {activeTab === "emprestimos" && (
          <section aria-label="Gerenciamento de empréstimos">
            <h3 tabIndex="0">🔄 Empréstimos Registrados</h3>

            <LoanComponents role={role} user={null} />
          </section>
        )}
      </div>

      <footer className="admin-footer" tabIndex="0">
        <small>
          Sistema integrado à API — desenvolvido com acessibilidade e inclusão ♿
        </small>
      </footer>
    </main>
  );
}
