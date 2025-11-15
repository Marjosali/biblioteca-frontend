import React from "react";
import { returnBook, getAuthHeaders } from "../Api";

export default function LoanList({ loans, loading, error, onReturn }) {
  const handleReturn = async (loanId, bookTitle) => {
    if (!window.confirm(`Tem certeza que deseja devolver o livro "${bookTitle}"?`)) return;

    try {
      await returnBook(loanId, getAuthHeaders());
      alert(`✅ Livro "${bookTitle}" devolvido com sucesso!`);

      if (onReturn) onReturn(); // Atualiza lista no componente pai
    } catch (err) {
      console.error("Erro ao devolver livro:", err);
      alert(`❌ Erro ao devolver livro "${bookTitle}".`);
    }
  };

  if (loading) return <p>⏳ Carregando empréstimos...</p>;
  if (error) return <p className="form-message error">{error}</p>;
  if (!loans || loans.length === 0) return <p>📭 Nenhum empréstimo encontrado.</p>;

  return (
    <section className="loan-list">
      <h2>📚 Meus Empréstimos</h2>
      <div className="loan-grid">
        {loans.map((loan) => (
          <article key={loan.id} className={`loan-item ${loan.returned ? "returned" : ""}`}>
            <p><strong>Livro:</strong> {loan.book_title}</p>
            <p><strong>Usuário:</strong> {loan.user_name}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={loan.returned ? "status-returned" : "status-active"}>
                {loan.returned ? "Devolvido" : "Emprestado"}
              </span>
            </p>
            <p>
              <strong>Data do Empréstimo:</strong>{" "}
              {loan.borrowed_at
                ? new Date(loan.borrowed_at).toLocaleDateString("pt-BR")
                : "Data não informada"}
            </p>

            {!loan.returned && (
              <button
                onClick={() => handleReturn(loan.id, loan.book_title)}
                className="return-btn"
              >
                🔄 Devolver Livro
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}