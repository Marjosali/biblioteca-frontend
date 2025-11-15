// src/components/BookGrid.js
import React from "react";
import PropTypes from "prop-types";
import BookCard from "./BookCard";
import "./bookgrid.css";

export default function BookGrid({ books = [], refreshBooks = null, role = "user" }) {
  // 🔥 Apenas ADMIN e SUPERUSER podem solicitar empréstimo
  const canLoan = role === "superuser" || role === "admin";

  // 🔹 Nenhum livro disponível
  if (!books || books.length === 0) {
    return (
      <p
        tabIndex="0"
        role="status"
        aria-live="polite"
        className="no-books-message"
      >
        📭 Nenhum livro cadastrado no momento.
      </p>
    );
  }

  return (
    <div
      className="book-grid"
      role="list"
      aria-label="Lista de livros disponíveis"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {books.map((book) => (
        <div
          role="listitem"
          key={book.id ?? `${book.title}-${book.author}-${Math.random()}`}
        >
          <BookCard
            book={book}
            refreshBooks={refreshBooks}
            canLoan={canLoan}   // 🔥 Permissão enviada ao BookCard
          />
        </div>
      ))}
    </div>
  );
}

BookGrid.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      cover: PropTypes.string,
      speak: PropTypes.func,
      altText: PropTypes.string,
      available: PropTypes.bool,
      publication_year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      genre: PropTypes.string,
      loans: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string,
          user_username: PropTypes.string,
        })
      ),
    })
  ),
  refreshBooks: PropTypes.func,
  role: PropTypes.string,
};
