import React, { useEffect, useState } from "react";
import { getBooks, createBook, deleteBook } from "../service/BookService";
import { getUserProfile } from "../service/UserService";
import "../styles.css";

export default function BookPanel() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "", available: true });

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookData, userData] = await Promise.all([getBooks(), getUserProfile()]);
        setBooks(bookData || []);
        setUser(userData || null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setMessage("❌ Não foi possível carregar os dados do servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Verificação de acesso
  const isSuperUser = user?.is_superuser || user?.role === "superuser";

  const handleCreateBook = async () => {
    if (!isSuperUser) {
      setMessage("⚠️ Acesso negado. Apenas superusuários podem cadastrar livros.");
      return;
    }
    if (!newBook.title || !newBook.author) {
      setMessage("⚠️ Preencha título e autor.");
      return;
    }

    try {
      const created = await createBook(newBook);
      setBooks((prev) => [...prev, created]);
      setMessage("✅ Livro cadastrado com sucesso!");
      setNewBook({ title: "", author: "", available: true });
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      setMessage("❌ Erro ao cadastrar livro.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!isSuperUser) {
      setMessage("⚠️ Acesso negado. Apenas superusuários podem excluir livros.");
      return;
    }
    if (!window.confirm("Deseja realmente excluir este livro?")) return;

    try {
      const success = await deleteBook(id);
      if (success) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        setMessage("🗑️ Livro removido com sucesso!");
      } else {
        setMessage("❌ Erro ao excluir livro.");
      }
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      setMessage("❌ Falha ao excluir livro.");
    }
  };

  if (loading) return <p>⏳ Carregando dados...</p>;

  // ✅ Bloqueia painel para quem não é superusuário
  if (!isSuperUser) {
    return (
      <div className="book-panel" role="alert" style={{ padding: "1rem", background: "#ffecec", borderRadius: "8px" }}>
        ⚠️ Acesso negado. Apenas superusuários podem acessar este painel.
      </div>
    );
  }

  return (
    <div className="book-panel" role="main" aria-label="Painel de livros">
      <h2>📚 Gerenciamento de Livros</h2>

      {message && (
        <p
          className="book-message"
          aria-live="polite"
          style={{
            background: "#eef6ff",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {message}
        </p>
      )}

      {/* 🔹 Formulário para cadastrar livro */}
      <div className="book-form">
        <h3>➕ Novo Livro</h3>
        <label htmlFor="title">Título:</label>
        <input
          id="title"
          type="text"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          placeholder="Digite o título"
        />

        <label htmlFor="author">Autor:</label>
        <input
          id="author"
          type="text"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          placeholder="Digite o autor"
        />

        <button onClick={handleCreateBook} className="book-action-btn create">
          ➕ Cadastrar Livro
        </button>
      </div>

      {/* 🔹 Lista de livros */}
      <div className="book-list" style={{ marginTop: "2rem" }}>
        {books.length === 0 ? (
          <p>📭 Nenhum livro cadastrado.</p>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Disponível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.available ? "✅ Sim" : "❌ Não"}</td>
                  <td>
                                         🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}