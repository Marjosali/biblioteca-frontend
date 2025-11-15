import React, { useState, useEffect } from "react";
import { getBooks } from "../services/api";
import VLibras from "@djpfs/react-vlibras";

export default function Search() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  const filteredBooks = books.filter(book =>
    book.titulo.toLowerCase().includes(query.toLowerCase()) ||
    book.autor.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div role="main" aria-label="Pesquisa de livros">
      <h1 tabIndex="0">Pesquisar Acervo 📖</h1>
      <input
        type="text"
        placeholder="Digite título ou autor"
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Pesquisar livros pelo título ou autor"
      />
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id} tabIndex="0">
            <img src={book.capa} alt={`Capa do livro ${book.titulo}`} width={50} height={70} />
            <strong>{book.titulo}</strong> - {book.autor} - Estoque: {book.estoque}
          </li>
        ))}
      </ul>
      <VLibras />
    </div>
  );
}
