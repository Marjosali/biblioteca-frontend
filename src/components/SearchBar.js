import React from "react";

export default function SearchBar({ query, setQuery }) {
  return (
    <div
      className="search-bar"
      role="search"
      aria-label="Barra de pesquisa de livros"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
        width: "100%",
        position: "relative",
      }}
    >
      <label htmlFor="book-search" className="sr-only">
        Pesquisar livros
      </label>

      <input
        id="book-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Pesquisar livros..."
        aria-describedby="search-hint"
        aria-label="Digite o nome ou autor do livro"
        style={{
          flex: 1,
          padding: "0.6rem 0.8rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "1rem",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#007bff";
          e.target.style.boxShadow = "0 0 4px rgba(0,123,255,0.3)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      />

      {query && (
        <button
          onClick={() => setQuery("")}
          aria-label="Limpar pesquisa"
          style={{
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#e0e0e0")}
          onMouseLeave={(e) => (e.target.style.background = "#f5f5f5")}
          onFocus={(e) => (e.target.style.outline = "2px solid #007bff")}
          onBlur={(e) => (e.target.style.outline = "none")}
        >
          ✖
        </button>
      )}

      <small id="search-hint" className="sr-only">
        Digite parte do nome, título ou autor do livro para pesquisar
      </small>
    </div>
  );
}
