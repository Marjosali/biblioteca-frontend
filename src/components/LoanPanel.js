import React, { useEffect, useState } from "react";
import {
  getLoans,
  createLoan,
  returnLoan,
  deleteLoan,
} from "../service/LoanService";
import { getBooks } from "../service/BookService";
import { getUserProfile } from "../service/UserService";
import "../styles.css";

export default function LoanPanel() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtros
  const [filterUser, setFilterUser] = useState("");
  const [filterTitle, setFilterTitle] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [loanData, bookData, userData] = await Promise.all([
          getLoans(),
          getBooks(),
          getUserProfile(),
        ]);

        setLoans(loanData || []);
        setBooks(bookData || []);
        setUser(userData || null);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setMessage("❌ Não foi possível carregar os dados do servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Verificação de acesso
  const isSuperUser = user?.is_superuser || user?.role === "superuser";

  const handleCreateLoan = async () => {
    if (!isSuperUser) {
      setMessage("⚠️ Acesso negado. Apenas superusuários podem criar empréstimos.");
      return;
    }
    if (!selectedBook) {
      setMessage("⚠️ Selecione um livro antes de criar um empréstimo.");
      return;
    }

    try {
      const newLoan = await createLoan({ book: selectedBook });
      setLoans((prev) => [...prev, newLoan]);
      setMessage("✅ Empréstimo registrado com sucesso!");
      setSelectedBook("");
    } catch (error) {
      console.error("Erro ao criar empréstimo:", error);
      setMessage("❌ Erro ao registrar empréstimo.");
    }
  };

  const handleReturnLoan = async (id) => {
    if (!isSuperUser) {
      setMessage("⚠️ Acesso negado. Apenas superusuários podem devolver livros.");
      return;
    }
    if (!window.confirm("Deseja marcar este livro como devolvido?")) return;

    try {
      await returnLoan(id);
      setLoans((prev) =>
        prev.map((l) => (l.id === id ? { ...l, returned: true } : l))
      );
      setMessage("✅ Livro devolvido com sucesso!");
    } catch (error) {
      console.error("Erro ao devolver livro:", error);
      setMessage("❌ Erro ao registrar devolução.");
    }
  };

  const handleDeleteLoan = async (id) => {
    if (!isSuperUser) {
      setMessage("⚠️ Acesso negado. Apenas superusuários podem excluir empréstimos.");
      return;
    }
    if (!window.confirm("Deseja realmente excluir este empréstimo?")) return;

    try {
      const success = await deleteLoan(id);
      if (success) {
        setLoans((prev) => prev.filter((l) => l.id !== id));
        setMessage("🗑️ Empréstimo removido com sucesso!");
      } else {
        setMessage("❌ Erro ao excluir empréstimo.");
      }
    } catch (error) {
      console.error("Erro ao excluir empréstimo:", error);
      setMessage("❌ Falha ao excluir empréstimo.");
    }
  };

  if (loading) return <p tabIndex="0">⏳ Carregando dados...</p>;

  // ✅ Se não for superusuário, bloqueia painel
  if (!isSuperUser) {
    return (
      <div className="loan-panel" role="alert" style={{ padding: "1rem", background: "#ffecec", borderRadius: "8px" }}>
        ⚠️ Acesso negado. Apenas superusuários podem acessar este painel.
      </div>
    );
  }

  // 🔹 Aplicar filtros antes da paginação
  const filteredLoans = loans.filter((loan) => {
    const matchUser = loan.user?.username
      ?.toLowerCase()
      .includes(filterUser.toLowerCase());
    const matchTitle = loan.book?.title
      ?.toLowerCase()
      .includes(filterTitle.toLowerCase());
    return matchUser && matchTitle;
  });

  const totalPages = Math.ceil(filteredLoans.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentLoans = filteredLoans.slice(startIndex, startIndex + pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleClearFilters = () => {
    setFilterUser("");
    setFilterTitle("");
    setCurrentPage(1);
  };

  return (
    <div className="loan-panel" role="main" aria-label="Painel de empréstimos">
      <h2 tabIndex="0">📚 Controle de Empréstimos</h2>

      {message && (
        <p
          className="loan-message"
          aria-live="polite"
          style={{
            background: "#eef6ff",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {message}
        </p>
      )}

      {/* 🔹 Filtros */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "20px" }}>
        <div>
          <label htmlFor="filterUser">Filtrar por usuário:</label>
          <input
            id="filterUser"
            type="text"
            value={filterUser}
            onChange={(e) => {
              setFilterUser(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Digite o nome do usuário"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <div>
          <label htmlFor="filterTitle">Filtrar por título:</label>
          <input
            id="filterTitle"
            type="text"
            value={filterTitle}
            onChange={(e) => {
              setFilterTitle(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Digite o título do livro"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <button
          onClick={handleClearFilters}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          🔄 Limpar filtros
        </button>
      </div>

      {/* 🔹 Seletor de itens por página */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="pageSize">Itens por página:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* 🔹 Formulário de novo empréstimo */}
      <div className="loan-form">
        <h3>➕ Novo Empréstimo</h3>
        <label htmlFor="bookSelect">Livro:</label>
        <select
          id="bookSelect"
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          aria-label="Selecione um livro para emprestar"
        >
          <option value="">-- Escolha um livro --</option>
          {books
            .filter((b) => b.available !== false)
            .map((b) => (
              <option key={b.id} value={b.id}>
                {b.title || b.titulo || "Sem título"}
              </option>
            ))}
        </select>

        <button onClick={handleCreateLoan} className="loan-action-btn create">
          ➕ Emprestar
        </button>
      </div>

      {/* 🔹 Lista de empréstimos */}
      <div className="loan-list">
        {filteredLoans.length === 0 ? (
          <p tabIndex="0">📭 Nenhum empréstimo encontrado.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="loan-table">
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Usuário</th>
                    <th>Data Empréstimo</th>
                    <th>Devolvido</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className={loan.returned ? "returned" : "active"}
                      tabIndex="0"
                    >
                      <td>{loan.book?.title || "Sem título"}</td>
                      <td>{loan.user?.username || user?.username || "Desconhecido"}</td>
                      <td>
                        {loan.loan_date
                          ? new Date(loan.loan_date).toLocaleDateString("pt-BR")
                          : "--"}
                      </td>
                      <td>{loan.returned ? "✅ Sim" : "⏳ Não"}</td>
                      <td>
                        {!loan.returned && (
                          <button
                            onClick={() => handleReturnLoan(loan.id)}
                            className="loan-action-btn return"
                          >
                            🔄 Devolver
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="loan-action-btn delete"
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔹 Controles de paginação */}
            <div className="pagination-controls" style={{ marginTop: "1rem" }}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="loan-action-btn"
              >
                ⬅️ Anterior
              </button>
              <span style={{ margin: "0 10px" }}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="loan-action-btn"
              >
                Próxima ➡️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}