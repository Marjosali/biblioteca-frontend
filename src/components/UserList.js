// src/components/UserList.js
import React, { useEffect, useState } from "react";
import { getUsers, getCurrentUser } from "../Api"; // ✅ caminho corrigido
import "../assets/styles.css"; // ✅ segue o padrão do projeto

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        // ✅ Proteção contra caso o usuário não tenha permissão
        if (user?.is_staff || user?.is_superuser) {
          const userList = await getUsers();
          setUsers(userList);
        } else {
          setError("⚠️ Você não tem permissão para visualizar os usuários.");
        }
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setError("❌ Falha ao carregar a lista de usuários.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#555" }}>⏳ Carregando usuários...</p>
    );

  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
        {error}
      </p>
    );

  return (
    <div className="user-list">
      <h2 style={{ textAlign: "center", color: "#004999" }}>👥 Usuários do Sistema</h2>

      {users.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhum usuário encontrado.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#004999", color: "#fff" }}>
              <th>ID</th>
              <th>Usuário</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Superuser</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_staff ? "✅" : "❌"}</td>
                <td>{u.is_superuser ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
