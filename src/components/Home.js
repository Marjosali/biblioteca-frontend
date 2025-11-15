import React, { useState, useEffect } from "react";
import LoanForm from "./LoanForm";
import { getCurrentUser } from "../Api"; // ✅ caminho ajustado para o seu projeto
import "../assets/styles.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("❌ Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>⏳ Carregando usuário...</p>;
  }

  const isAdmin = user?.is_superuser || user?.is_staff;

  return (
    <main className="home-container" role="main" aria-label="Painel da Biblioteca">
      <header className="home-header">
        <h1 tabIndex="0">📚 Painel da Biblioteca</h1>
        <p tabIndex="0">
          {isAdmin
            ? "Administrador: gerencie livros, usuários e empréstimos."
            : "Usuário: visualize e registre seus empréstimos."}
        </p>

        {isAdmin && (
          <p>
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-link"
            >
              ⚙️ Acessar Painel Django Admin
            </a>
          </p>
        )}
      </header>

      {/* Usuário comum só vê o formulário de empréstimo */}
      {!isAdmin && <LoanForm />}

      <footer className="home-footer" tabIndex="0">
        <small>
          Desenvolvido com foco em acessibilidade e inclusão digital ♿
        </small>
      </footer>
    </main>
  );
}
