import React, { useState } from "react";
import { createUser } from "../Api";

export default function UserForm({ onUserCreated }) {
  const [username, setUsername] = useState("");
  const [turma, setTurma] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await createUser({ username, turma, password });
      setMessage({ text: "✅ Usuário criado com sucesso!", type: "success" });
      setUsername("");
      setTurma("");
      setPassword("");
      if (onUserCreated) onUserCreated();
    } catch (err) {
      setMessage({ text: `❌ Erro ao criar usuário: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>➕ Criar Novo Usuário</h3>
      {message.text && (
        <p style={{ color: message.type === "error" ? "red" : "green" }}>
          {message.text}
        </p>
      )}
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Turma"
        value={turma}
        onChange={(e) => setTurma(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Criar Usuário"}
      </button>
    </form>
  );
}
