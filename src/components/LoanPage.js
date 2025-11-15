import React, { useEffect, useState } from "react";
import LoanForm from "./LoanForm";
import LoanList from "./LoanList";
import { getLoans, getAuthHeaders } from "../Api";

export default function LoanPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Função para carregar empréstimos
  const fetchLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getLoans(getAuthHeaders());
      const username = localStorage.getItem("username") || "";
      const myLoans = response.data.filter(
        (loan) => loan.user?.username === username
      );
      setLoans(myLoans);
    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
      setError("⚠️ Não foi possível carregar os empréstimos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="loan-page">
      <h1>📖 Sistema de Empréstimos</h1>

      {/* Formulário para criar empréstimo */}
      <LoanForm onLoanCreated={fetchLoans} />

      {/* Lista de empréstimos */}
      <LoanList loans={loans} loading={loading} error={error} onReturn={fetchLoans} />
    </div>
  );
}