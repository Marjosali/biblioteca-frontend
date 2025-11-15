// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import BookForm from "./BookForm";
import UserForm from "./UserForm";
import LoanForm from "./LoanForm";
import BookCard from "./BookCard";
import { getBooks, deleteBook, getUsers, getLoans } from "../services/api";
import "../assets/styles.css";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  // 🔹 Carrega dados do backend
  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao carregar livros:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  const loadLoans = async () => {
    try {
      const data = await getLoans();
      setLoans(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Erro ao carregar empréstimos:", err);
    }
  };

  useEffect(() => {
    loadBooks();
    loadUsers();
    loadLoans();
  }, []);

  const handleEdit = (book) => setEditingBook(book);

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente deletar este livro?")) {
      try {
        await deleteBook(id);
        await loadBooks();
      } catch (err) {
        console.error("Erro ao deletar livro:", err);
        alert("Falha ao deletar livro. Verifique o console.");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 tabIndex="0">📋 Painel Administrativo</h1>

      {/* ====== Formulários de cadastro ====== */}
      <div className="admin-forms">
        <div className="admin-form">
          <h2 tabIndex="0">📘 Cadastro de Livros</h2>
          <BookForm
            onSave={() => {
              loadBooks();
              setEditingBook(null);
            }}
            editingBook={editingBook}
          />
        </div>

        <div className="admin-form">
          <h2 tabIndex="0">👥 Cadastro de Usuários</h2>
          <UserForm refreshUsers={loadUsers} />
        </div>

        <div className="admin-form">
          <h2 tabIndex="0">📑 Cadastro de Empréstimos</h2>
          <LoanForm onSave={loadLoans} isAdmin={true} />
        </div>
      </div>

      {/* ====== Lista de livros ====== */}
      <section className="book-list-section">
        <h2 tabIndex="0">📚 Lista de Livros</h2>
        {books.length === 0 ? (
          <p tabIndex="0">Nenhum livro cadastrado ainda.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
