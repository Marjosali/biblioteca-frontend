import React, { useState, useRef } from "react";
import { saveBook } from "../services/api";

export default function UploadBook({ onUpload }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const messageRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !cover) {
      setMessage("⚠️ Por favor, preencha todos os campos e selecione uma capa.");
      setIsError(true);
      messageRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("cover", cover);

    try {
      setLoading(true);
      await saveBook(formData);
      setMessage("✅ Livro adicionado com sucesso!");
      setIsError(false);
      setTitle("");
      setAuthor("");
      setCover(null);
      onUpload?.();
      messageRef.current?.focus();
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro ao adicionar livro. Tente novamente.");
      setIsError(true);
      messageRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="upload-form"
      aria-label="Formulário de upload de livro"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: "#ffffff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        margin: "1rem auto",
      }}
    >
      <h3
        tabIndex="0"
        style={{ textAlign: "center", color: "#004999", marginBottom: "0.5rem" }}
      >
        📘 Adicionar Livro
      </h3>

      {message && (
        <p
          role="alert"
          tabIndex="-1"
          ref={messageRef}
          aria-live="polite"
          className={isError ? "error-message" : "success-message"}
        >
          {message}
        </p>
      )}

      <label htmlFor="book-title">Título</label>
      <input
        id="book-title"
        type="text"
        placeholder="Digite o título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-required="true"
        aria-label="Título do livro"
      />

      <label htmlFor="book-author">Autor</label>
      <input
        id="book-author"
        type="text"
        placeholder="Digite o autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        aria-required="true"
        aria-label="Autor do livro"
      />

      <label htmlFor="book-cover">Capa do livro</label>
      <input
        id="book-cover"
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files[0])}
        required
        aria-required="true"
        aria-label="Selecione a capa do livro"
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#999" : "#007bff",
          color: "#fff",
          padding: "0.6rem",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.3s",
        }}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
