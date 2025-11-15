import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles.css";

export default function ReturnForm({ onSave }) {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const token = localStorage.getItem("access_token");

  // 🔹 Carrega empréstimos ativos
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/loans/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Apenas empréstimos não devolvidos
        const activeLoans = res.data.filter((loan) => !loan.returned);
        setLoans(activeLoans);

      } catch (err) {
        console.error(err);
      }
    };

    fetchLoans();
  }, [token, onSave]);

  const handleReturn = async (e) => {
    e.preventDefault();

    if (!selectedLoan) {
      setMessage("Por favor, selecione um empréstimo.");
      setIsError(true);
      return;
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/loans/${selectedLoan}/`,
        { returned: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Empréstimo devolvido com sucesso!");
      setIsError(false);

      // Remove da lista
      setLoans(loans.filter((loan) => loan.id !== Number(selectedLoan)));

      setSelectedLoan("");

      if (onSave) onSave();

      setTimeout(() => setMessage(""), 5000);

    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao devolver livro.");
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleReturn} className="return-form" aria-label="Formulário de devolução">
      <h3 tabIndex="0">📖 Registrar Devolução</h3>

      {message && (
        <p role="alert" tabIndex="0" className={isError ? "error-message" : "success-message"}>
          {message}
        </p>
      )}

      <label htmlFor="loan">Selecione o Empréstimo:</label>
      <select
        id="loan"
        value={selectedLoan}
        onChange={(e) => setSelectedLoan(e.target.value)}
        required
      >
        <option value="">-- Selecione um empréstimo ativo --</option>
        
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {loan.book?.title || "Livro sem título"} 
            {" — Usuário: "}
            {loan.user?.username || "Desconhecido"}
          </option>
        ))}
      </select>

      <button type="submit" className="btn-primary">
        Registrar Devolução
      </button>
    </form>
  );
}
