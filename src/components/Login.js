import React, { useState, useEffect } from "react";
import { login, getCurrentUser } from "../Api// usar Api.js consitente
import AccessibilityBar from "./AccessibilityBar";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Carrega VLibras
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Faz login e salva tokens no localStorage
      await login(username, password);

      // Recupera dados do usuário logado
      const userData = await getCurrentUser();
      if (!userData) throw new Error("Falha ao obter dados do usuário");

      // Atualiza estado do App.js
      if (onLogin) await onLogin();
    } catch (err) {
      console.error("Erro no login:", err);
      // tenta mostrar mensagem do backend se houver
      if (err?.response?.data?.detail) {
        setError(`❌ ${err.response.data.detail}`);
      } else {
        setError("❌ Usuário ou senha incorretos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4" role="main">
      <AccessibilityBar />

      <h1
        tabIndex="0"
        className="text-3xl font-bold text-blue-900 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        📚 Acesso à Biblioteca Acessível
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        aria-label="Formulário de login"
        aria-busy={loading}
      >
        {error && (
          <div role="alert" aria-live="assertive" className="bg-red-100 text-red-800 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <label htmlFor="username" className="block mb-2 font-semibold">Usuário</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label htmlFor="password" className="block mb-2 font-semibold">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* VLibras */}
      <div vw className="enabled mt-6">
        <div vw-access-button className="active"></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </div>
  );
}
