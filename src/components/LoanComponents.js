// src/components/LoanComponents.js
import React, { useEffect, useState } from "react";
import {
  getLoans,
  getBooks,
  getUsers,
  createLoan,
  returnBook,
} from "../Api";

export default function LoanComponents() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [searchBook, setSearchBook] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [turma, setTurma] = useState("");

  // 🔹 Carrega dados da API
  const loadData = async () => {
    try {
      const l = await getLoans();
      const b = await getBooks();
      const u = await getUsers();

      setLoans(l || []);
      setBooks(b || []);
      setUsers(u || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Registrar empréstimo
  const handleCreateLoan = async () => {
    if (!selectedUser || !selectedBook) {
      alert("Selecione um usuário e um livro.");
      return;
    }

    try {
      const result = await createLoan({
        user_id: selectedUser,
        book_id: selectedBook,
        turma: turma,
      });

      if (result.error) {
        alert("Erro: " + JSON.stringify(result.error));
        return;
      }

      alert("✅ Empréstimo registrado com sucesso!");
      setSelectedUser("");
      setSelectedBook("");
      setTurma("");
      loadData();
    } catch (error) {
      alert("❌ Erro ao registrar empréstimo.");
    }
  };

  // 🔹 Registrar devolução
  const handleReturn = async (loanId) => {
    if (!window.confirm("Confirmar devolução?")) return;
    try {
      await returnBook(loanId);
      alert("✅ Livro devolvido!");
      loadData();
    } catch (error) {
      alert("❌ Erro ao devolver livro.");
    }
  };

  // 🔎 Filtros inteligentes
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchBook.toLowerCase())
  );

  return (
    <div className="loan-panel">
      <h2>📚 Gerenciar Empréstimos</h2>

      {/* Formulário */}
      <div className="loan-form">
        {/* Usuário */}
        <label>Usuário:</label>
        <input
          type="text"
          placeholder="Digite nome do usuário…"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecione…</option>
          {filteredUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        {/* Livro */}
        <label>Livro:</label>
        <input
          type="text"
          placeholder="Digite o nome do livro…"
          value={searchBook}
          onChange={(e) => setSearchBook(e.target.value)}
        />

        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
        >
          <option value="">Selecione…</option>
          {filteredBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        {/* Turma */}
        <label>Turma (opcional):</label>
        <input
          type="text"
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          placeholder="Ex: 6º Ano A"
        />

        <button onClick={handleCreateLoan}>Registrar Empréstimo</button>
      </div>

      {/* Lista */}
      <h3>📄 Lista de Empréstimos</h3>

      {loans.length === 0 ? (
        <p>Nenhum empréstimo registrado.</p>
      ) : (
        <table className="loan-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Livro</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => {
              const borrowed = new Date(loan.borrowed_at);
              const returned = loan.returned;

              return (
                <tr key={loan.id}>
                  {/* ✅ Corrigido: usa user_name */}
                  <td>{loan.user_name}</td>
                  <td>{loan.book_title}</td>
                  <td>{borrowed.toLocaleDateString("pt-BR")}</td>
                  <td>
                    {returned ? (
                      <span className="badge green">Devolvido</span>
                    ) : (
                      <span className="badge yellow">Ativo</span>
                    )}
                  </td>
                  <td>
                    {!returned && (
                      <button
                        className="btn-return"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}