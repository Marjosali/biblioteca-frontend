import React, { useEffect, useState } from "react";
import { createLoan, getBooks, getLoans, getUsers, returnBook } from "../Api";

export default function LoanForm({ onLoanCreated }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const [loanId, setLoanId] = useState("");
  const [turma, setTurma] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const booksRes = await getBooks();
        const usersRes = await getUsers();
        const loansRes = await getLoans();

        // Apenas livros disponíveis
        const availableBooks = (Array.isArray(booksRes) ? booksRes : booksRes.results || [])
          .filter((b) => b.available !== false);

        setBooks(availableBooks);
        setUsers(Array.isArray(usersRes) ? usersRes : usersRes.results || []);

        // Apenas empréstimos ativos
        const activeLoans = (Array.isArray(loansRes) ? loansRes : loansRes.results || [])
          .filter((loan) => !loan.returned);

        setLoans(activeLoans);

      } catch (err) {
        console.error(err);
        setError("❌ Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =====================================================
  // 🔹 Registrar Empréstimo
  // =====================================================
  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        book_id: Number(bookId),
        user_id: Number(userId),
        turma,
      };

      await createLoan(payload);

      setSuccess("✅ Empréstimo registrado com sucesso!");
      setBookId("");
      setUserId("");
      setTurma("");

      if (onLoanCreated) onLoanCreated();

    } catch (err) {
      console.error(err);
      setError("❌ Erro ao registrar empréstimo.");
    }
  };

  // =====================================================
  // 🔹 Registrar Devolução
  // =====================================================
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await returnBook(Number(loanId));

      setSuccess("🔄 Livro devolvido com sucesso!");
      setLoanId("");

      if (onLoanCreated) onLoanCreated();

    } catch (err) {
      console.error(err);
      setError("❌ Erro ao registrar devolução.");
    }
  };

  if (loading) return <p>⏳ Carregando dados...</p>;

  return (
    <section className="loan-form">

      {/* ------------------------------------------------- */}
      {/*       FORMULÁRIO DE EMPRÉSTIMO                  */}
      {/* ------------------------------------------------- */}
      <h2>📚 Registrar Empréstimo</h2>

      <form onSubmit={handleLoanSubmit}>
        <label>Usuário:</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Selecione um usuário</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} — {user.nome || user.name || "Sem nome"}
            </option>
          ))}
        </select>

        <label>Turma:</label>
        <input
          type="text"
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          placeholder="Ex: 3º Ano A"
        />

        <label>Livro:</label>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Selecione um livro</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>

        <button type="submit">Salvar Empréstimo</button>
      </form>

      <hr />

      {/* ------------------------------------------------- */}
      {/*       FORMULÁRIO DE DEVOLUÇÃO                   */}
      {/* ------------------------------------------------- */}
      <h2>🔄 Registrar Devolução</h2>

      <form onSubmit={handleReturnSubmit}>
        <label>Empréstimo:</label>
        <select value={loanId} onChange={(e) => setLoanId(e.target.value)} required>
          <option value="">Selecione o empréstimo</option>
          {loans.map((loan) => (
            <option key={loan.id} value={loan.id}>
              {loan.book_title || "Livro sem título"} — {loan.user_username || "Usuário"}
            </option>
          ))}
        </select>

        <button type="submit">Devolver Livro</button>
      </form>

      {/* ------------------------------------------------- */}
      {/*       MENSAGENS                                  */}
      {/* ------------------------------------------------- */}
      {error && <p className="form-message error">{error}</p>}
      {success && <p className="form-message success">{success}</p>}
    </section>
  );
}