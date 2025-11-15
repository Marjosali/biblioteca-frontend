import React, { useState } from "react";
import PropTypes from "prop-types";
import { refreshToken, logout, getAuthHeaders } from "../Api";

const API_URL = "http://127.0.0.1:8000/api/";

export default function LoanButton({ bookId, refreshBooks, disabled = false }) {
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");

  // 🔒 Se usuário for comum, não mostra botão
  if (role !== "admin" && role !== "superuser") {
    return null;
  }

  const requestLoan = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("⚠️ Você precisa estar logado!");
      return;
    }

    setLoading(true);

    try {
      let res = await fetch(`${API_URL}loans/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: bookId }),
      });

      if (res.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          res = await fetch(`${API_URL}loans/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ book: bookId }),
          });
        } else {
          logout();
          alert("⚠️ Sessão expirada. Faça login novamente.");
          return;
        }
      }

      if (res.ok) {
        alert("✅ Empréstimo registrado com sucesso!");
        if (refreshBooks) refreshBooks();
        return;
      }

      const errData = await res.json().catch(() => ({}));
      alert(
        "⚠️ Erro ao registrar empréstimo: " +
          (errData.detail || "Tente novamente mais tarde.")
      );
    } catch (error) {
      console.error("Erro ao solicitar empréstimo:", error);
      alert("❌ Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={requestLoan}
      disabled={loading || disabled}
      aria-label="Registrar empréstimo"
      aria-live="polite"
      className={`loan-btn ${loading ? "loading" : ""}`}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        border: "none",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        backgroundColor: loading || disabled ? "#999" : "#007bff",
        color: "#fff",
        fontWeight: "bold",
        transition: "background 0.3s",
      }}
    >
      {loading ? "🔄 Registrando..." : "📚 Registrar Empréstimo"}
    </button>
  );
}

LoanButton.propTypes = {
  bookId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  refreshBooks: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
