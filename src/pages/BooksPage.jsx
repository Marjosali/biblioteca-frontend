import React, { useEffect, useState } from "react";
import { getBooks } from "../Api";
import BookList from "../components/BookList";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      const lista = Array.isArray(data) ? data : data.results || [];
      setBooks(lista);
    } catch (err) {
      setError("Erro ao carregar livros.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔍 Filtrar livros por título ou autor
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>📚 Acervo de Livros</h1>

      {/* Barra de busca */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Pesquisar por título ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "60%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          aria-label="Campo de pesquisa por título ou autor"
        />
      </div>

      {/* Estado de carregamento ou erro */}
      {loading && <p style={{ textAlign: "center" }}>⏳ Carregando...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* Lista filtrada */}
      {!loading && !error && (
        <BookList books={filteredBooks} refreshBooks={fetchBooks} />
      )}
    </main>
  );
}