import React, { useEffect, useState } from "react";
import BookGrid from "./BookGrid";
import { getBooks } from "../Api";
import { useAuth } from "../context/AuthContext";   // ✅ Agora lê login direto do contexto
import "./booklist.css";

export default function BookList({ refreshBooksParent = null }) {
  const { user, loading } = useAuth();  // 🔥 Agora é 100% confiável: logado ou não
  const [books, setBooks] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (!user) {
      setBooks([]);
      setError("🔒 Faça login para acessar o catálogo de livros.");
      return;
    }

    setFetchLoading(true);
    setError("");

    try {
      const list = await getBooks();
      setBooks(Array.isArray(list) ? list : []);
      refreshBooksParent?.(list);
      console.log("📚 Livros carregados:", list);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
      setError("❌ Não foi possível carregar os livros.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user]);   // 🔥 Atualiza quando loga/desloga

  const speakBook = (book) => {
    if (!book || !("speechSynthesis" in window)) return;
    const msg = new SpeechSynthesisUtterance(
      `Livro: ${book.title}. Autor: ${book.author}. Ano: ${book.publication_year}.`
    );
    window.speechSynthesis.speak(msg);
  };

  // 🔹 Tela de carregamento (login ainda verificando)
  if (loading) return <p>⏳ Carregando usuário...</p>;

  return (
    <section className="book-list" aria-label="Catálogo de livros">
      {fetchLoading && <p>⏳ Carregando livros...</p>}

      {!fetchLoading && !user && (
        <p className="error-message">🔒 Faça login para acessar o catálogo de livros.</p>
      )}

      {!fetchLoading && user && books.length === 0 && !error && (
        <p>📭 Nenhum livro encontrado.</p>
      )}

      {!fetchLoading && user && !error && books.length > 0 && (
        <BookGrid
          books={books.map((b) => ({
            ...b,
            speak: () => speakBook(b),
            altText: `Capa do livro ${b.title}`,
          }))}
          refreshBooks={fetchBooks}
        />
      )}

      {!fetchLoading && error && <p className="error-message">{error}</p>}
    </section>
  );
}
