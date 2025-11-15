import React, { useEffect, useState } from "react";
import { getBooks, saveBook } from "../Api";
import { getAuthHeaders } from "../authService"; // ✅ Importação corrigida
import "../assets/styles.css";

export default function BookAdminPanel() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      // ✅ Ajuste para lidar com API paginada ou lista simples
      const lista = Array.isArray(data) ? data : data.results || [];
      setBooks(lista);
    } catch (err) {
      setMessage({ text: "❌ Erro ao buscar livros.", type: "error" });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookData = { title, author, year, category };
      if (editingId) bookData.id = editingId;

      await saveBook(bookData);
      setMessage({
        text: editingId ? "✅ Livro atualizado!" : "✅ Livro cadastrado!",
        type: "success",
      });

      // ✅ Limpar campos
      setTitle("");
      setAuthor("");
      setYear("");
      setCategory("");
      setEditingId(null);

      fetchBooks();
    } catch (err) {
      setMessage({ text: `❌ Erro ao salvar livro: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    setCategory(book.category);
    setEditingId(book.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este livro?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() }, // ✅ Corrigido
      });
      if (!response.ok) throw new Error("Erro ao excluir livro");
      setMessage({ text: "🗑️ Livro excluído!", type: "success" });
      fetchBooks();
    } catch (err) {
      setMessage({ text: `❌ ${err.message}`, type: "error" });
    }
  };

  return (
    <div className="admin-panel">
      <h2>📚 Painel Administrativo de Livros</h2>

      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <h4>{editingId ? "✏️ Editar Livro" : "➕ Adicionar Livro"}</h4>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          placeholder="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : editingId ? "Atualizar Livro" : "Cadastrar Livro"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setAuthor("");
              setYear("");
              setCategory("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>{book.category}</td>
              <td>
 <button onClick={() => handleEdit(book)}>✏️ Editar</button>
                <button onClick={() => handleDelete(book.id)}>❌ Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}