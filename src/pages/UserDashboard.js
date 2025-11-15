import React, { useEffect, useState } from "react";
import { getBooks } from "../Api"; // ✅ Importação corrigida
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import LoanList from "../components/LoanList";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Buscar livros usando função do Api.js
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const lista = await getBooks(); // Função já normaliza resposta
      setBooks(lista);
      console.log("📚 Livros carregados:", lista);
    } catch (err) {
      console.error("❌ Erro ao buscar livros:", err);
      setError("Não foi possível carregar os livros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      {/* Seção de Acervo */}
      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            color: "#004999",
            textAlign: "center",
            marginBottom: "20px",
          }}
          tabIndex="0"
        >
          📚 Acervo de Livros
        </h2>

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
        {loading && (
          <p style={{ textAlign: "center" }} aria-live="polite">
            ⏳ Carregando livros...
          </p>
        )}
        {error && (
          <p style={{ textAlign: "center", color: "red" }} role="alert">
            {error}
          </p>
        )}

        {/* Grid de livros */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
            role="list"
            aria-label="Lista de livros disponíveis"
          >
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p
                style={{ textAlign: "center", gridColumn: "1 / -1" }}
                role="status"
              >
                📭 Nenhum livro encontrado.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Seção de Meus Empréstimos */}
      <section>
        <h2
          style={{
            color: "#004999",
            textAlign: "center",
            marginBottom: "20px",
          }}
          tabIndex="0"
        >
          📖 Meus Empréstimos
        </h2>
        <LoanList />
      </section>
    </div>
  );
};

export default UserDashboard;