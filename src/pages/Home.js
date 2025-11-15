import React, { useState } from "react";
import BookList from "../components/BookList";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#004999" }}>
        Catálogo de Livros
      </h1>

      {/* Barra de pesquisa */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Buscar livro por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "60%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Lista de livros */}
      <BookList searchTerm={searchTerm} />
    </div>
  );
}

