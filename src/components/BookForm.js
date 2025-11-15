import React, { useState } from "react";
import { createBook } from "../Api";

export default function BookForm({ onSave }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState(null);
  const [anoPublicacao, setAnoPublicacao] = useState(""); // ✅ Novo campo
  const [genero, setGenero] = useState(""); // ✅ Novo campo
  const [message, setMessage] = useState("");

  const isSuperUser = JSON.parse(localStorage.getItem("user_info"))?.is_superuser;

  if (!isSuperUser) {
    return <p className="access-denied">⚠️ Acesso negado. Apenas superusuários podem cadastrar livros.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !anoPublicacao || !genero) {
      setMessage("⚠️ Preencha título, autor, ano de publicação e gênero.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("ano_publicacao", anoPublicacao); // ✅ Incluindo ano
    formData.append("genero", genero); // ✅ Incluindo gênero
    if (cover) formData.append("cover", cover);

    try {
      await createBook(formData);
      setMessage("✅ Livro cadastrado com sucesso!");
      setTitle("");
      setAuthor("");
      setAnoPublicacao("");
      setGenero("");
      setCover(null);
      onSave?.();
    } catch (error) {
      setMessage(`❌ Erro: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3>➕ Cadastrar Livro</h3>
      {message && <p>{message}</p>}
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ano de Publicação"
        value={anoPublicacao}
        onChange={(e) => setAnoPublicacao(e.target.value)}
      />
      <input
        type="text"
        placeholder="Gênero Literário"
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
      />
      <input type="file" onChange={(e) => setCover(e.target.files[0])} />
      <button type="submit">Salvar</button>
    </form>
  );
}