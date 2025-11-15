import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUsers } from "../Api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor, preencha usuário e senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(username, password);
      const users = await getUsers();
      const user = users.find((u) => u.username === username);
      if (!user) throw new Error("Usuário não encontrado");

      const role = user.is_superuser || user.is_staff ? "admin" : "user";
      localStorage.setItem("role", role);

      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error(err);
      setError("Erro ao logar. Verifique usuário e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div style={{ width: "350px", padding: "30px", background: "#fff", borderRadius: "8px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#004999" }}>Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#004999",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? "Entrando..." : "Login"}
        </button>
      </div>
    </main>
  );
}