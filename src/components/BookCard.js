import React from "react";
import PropTypes from "prop-types";
import "./bookcard.css";
import noCover from "../assets/no-cover.png";
import LoanButton from "./LoanButton";

export default function BookCard({ book, refreshBooks = null, canLoan = false }) {
  // ✅ Usa cover_image do backend e monta URL completa se necessário
  const coverUrl = book.cover_image
    ? book.cover_image.startsWith("http")
      ? book.cover_image
      : `http://127.0.0.1:8000${book.cover_image}`
    : noCover;

  // 🔹 Texto descritivo para acessibilidade
  const bookLabel = `
    Livro: ${book.title || "Sem título"}.
    Autor: ${book.author || "Não informado"}.
    ${book.publication_year ? `Ano: ${book.publication_year}.` : ""}
    ${book.genre ? `Gênero: ${book.genre}.` : ""}
    Status: ${book.available ? "Disponível" : "Emprestado"}.
  `;

  return (
    <article
      className={`book-card ${!book.available ? "unavailable" : ""}`}
      role="region"
      aria-label={bookLabel.trim()}
    >
      <img
        src={coverUrl}
        alt={book.altText || `Capa do livro "${book.title || "Sem título"}"`}
        className="book-cover"
        loading="lazy"
      />

      <div className="book-info">
        <h2>{book.title || "Sem título"}</h2>

        <p>
          <strong>Autor:</strong> {book.author || "Não informado"}
        </p>

        {book.publication_year && (
          <p>
            <strong>Ano:</strong> {book.publication_year}
          </p>
        )}

        {book.genre && (
          <p>
            <strong>Gênero:</strong> {book.genre}
          </p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          {book.available ? "Disponível" : "Emprestado"}
        </p>

        {book.loans?.length > 0 && (
          <p>
            <strong>Emprestado para:</strong>{" "}
            {book.loans
              .map((loan) => loan.user_username || loan.username)
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        {/* 🔊 Botão de leitura por voz */}
        {book.speak && (
          <button
            type="button"
            onClick={book.speak}
            className="speak-button"
            aria-label={`Ouvir informações do livro ${book.title}`}
          >
            🔊 Ouvir
          </button>
        )}

        {/* 📘 Empréstimo (somente admin/superuser e se disponível) */}
        {canLoan && book.available && refreshBooks && (
          <LoanButton bookId={book.id} refreshBooks={refreshBooks} />
        )}
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    publication_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    genre: PropTypes.string,
    cover_image: PropTypes.string, // ✅ Corrigido para cover_image
    altText: PropTypes.string,
    available: PropTypes.bool,
    loans: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string,
        user_username: PropTypes.string,
      })
    ),
    speak: PropTypes.func,
  }).isRequired,
  refreshBooks: PropTypes.func,
  canLoan: PropTypes.bool,
};