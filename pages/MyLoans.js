// src/pages/MyLoans.js
import React, { useEffect, useState } from "react";
import { getLoans, returnLoan, getCurrentUser } from "../Api";

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const u = await getCurrentUser();
      setUser(u);

      const allLoans = await getLoans();

      // ✅ Corrigido: usa user_name do backend
      const userLoans = allLoans.filter(
        (loan) => loan.user_name === u.username
      );

      setLoans(userLoans);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Calcula atraso
  const getDelay = (date) => {
    const borrowed = new Date(date);
    const today = new Date();
    const diff = Math.floor((today - borrowed) / (1000 * 60 * 60 * 24));
    const limitDays = 7; // prazo padrão
    const delay = diff - limitDays;
    return delay > 0 ? delay : 0;
  };

  // ✅ Devolver livro
  const handleReturn = async (loanId) => {
    if (!window.confirm("Tem certeza que deseja devolver este livro?")) return;

    try {
      await returnLoan(loanId);
      alert("✅ Livro devolvido com sucesso!");
      loadData();
    } catch (error) {
      alert("❌ Erro ao devolver livro.");
    }
  };

  if (loading) return <p>⏳ Carregando seus empréstimos…</p>;

  return (
    <main className="my-loans">
      <h1>📚 Meus Empréstimos</h1>

      {loans.length === 0 ? (
        <p>Você não possui empréstimos registrados.</p>
      ) : (
        <table className="loan-table">
          <thead>
            <tr>
              <th>Livro</th>
              <th>Data do Empréstimo</th>
              <th>Status</th>
              <th>Atraso</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => {
              const borrowedDate = new Date(loan.borrowed_at).toLocaleDateString("pt-BR");
              const delay = getDelay(loan.borrowed_at);

              return (
                <tr key={loan.id}>
                  <td>{loan.book_title}</td>
                  <td>{borrowedDate}</td>
                  <td>
                    {loan.returned ? (
                      <span className="badge green">Devolvido</span>
                    ) : (
                      <span className="badge yellow">Ativo</span>
                    )}
                  </td>
                  <td>
                    {!loan.returned && delay > 0 ? (
                      <span className="badge red">Atrasado {delay} dias</span>
                    ) : (
                      <span className="badge green">No prazo</span>
                    )}
                  </td>
                  <td>
                    {!loan.returned ? (
                      <button onClick={() => handleReturn(loan.id)}>Devolver</button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}