import React, { useEffect, useState } from "react";
import { getBooks, createBook } from "../Api"; // ✅ Importações corretas
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Buscar livros
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const lista = await getBooks(); // Função do Api.js
      setBooks(lista);
    } catch (err) {
      console.error("❌ Erro ao buscar livros:", err);
      setMessage("Erro ao buscar livros.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Adicionar livro
  const handleAddBook = async () => {
    if (!title || !author) {
      setMessage("Título e Autor são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("description", description);
      if (cover) formData.append("cover_image", cover);

      await createBook(formData); // Função do Api.js
      setTitle("");
      setAuthor("");
      setDescription("");
      setCover(null);
      setMessage("✅ Livro adicionado com sucesso!");
      fetchBooks();
    } catch (err) {
      console.error("❌ Erro ao adicionar livro:", err);
      setMessage("Erro ao adicionar livro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="admin-dashboard" style={{ padding: "20px" }}>
      <Navbar />
      <h2 style={{ color: "#004999", textAlign: "center" }}>📚 Dashboard do Administrador</h2>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}

      {/* Formulário para adicionar livro */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Adicionar Livro</h3>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setCover(e.target.files[0])}
        />
        <button onClick={handleAddBook} disabled={loading}>
          {loading ? "Salvando..." : "Adicionar"}
        </button>
      </section>

      {/* Lista de livros */}
      <section>
        <h3>Acervo</h3>
        {loading && <p>Carregando livros...</p>}
        <div style={{ display: "grid", gap: "20px" }}>
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.id} book={book} refreshBooks={fetchBooks} />
            ))
          ) : (
            <p>Nenhum livro encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;