// src/components/TestFormPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TestFormPage() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, booksRes, loansRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/users/", { headers }),
          axios.get("http://127.0.0.1:8000/api/books/", { headers }),
          axios.get("http://127.0.0.1:8000/api/loans/", { headers }),
        ]);
        setUsers(usersRes.data);
        setBooks(booksRes.data);
        setLoans(loansRes.data);
      } catch (err) {
        console.error(err);
        setMessage("Erro ao carregar dados da API");
      }
    }
    fetchData();
  }, []);

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBook) {
      setMessage("Selecione usuário e livro!");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/loans/",
        { user: selectedUser, book: selectedBook },
        { headers }
      );
      setMessage("Empréstimo registrado!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao registrar empréstimo");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Teste de Formulários</h2>
      
      <h3>Cadastro de Empréstimos</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleLoanSubmit}>
        <label>
          Usuário:
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">--Selecione--</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Livro:
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">--Selecione--</option>
            {books
              .filter((b) => b.available)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
          </select>
        </label>
        <br />
        <button type="submit">Registrar Empréstimo</button>
      </form>

      <h3>Empréstimos Ativos</h3>
      <ul>
        {loans.map((l) => (
          <li key={l.id}>
            {l.book?.title} - {l.user?.username} ({l.returned ? "Devolvido" : "Ativo"})
          </li>
        ))}
      </ul>
    </div>
  );
}
