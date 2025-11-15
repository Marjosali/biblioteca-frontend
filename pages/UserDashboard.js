import React, { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookCard from "../components/BookCard";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  const requestLoan = (id) => alert(`Solicitando empréstimo do livro ID: ${id}`);

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>Catálogo de Livros</h1>
      {books.length ? (
        books.map(book => (
          <BookCard key={book.id} book={book} requestLoan={requestLoan} />
        ))
      ) : (
        <p>Nenhum livro cadastrado.</p>
      )}
    </div>
  );
}
