import { getAuthHeaders, refreshAccessToken, isAuthenticated } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/books/";

/**
 * 🔹 Busca todos os livros disponíveis
 */
export async function getBooks() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return getBooks();
    }

    if (!response.ok) throw new Error("Erro ao buscar livros");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao obter livros:", error);
    return [];
  }
}

/**
 * 🔹 Obtém detalhes de um livro específico
 */
export async function getBookById(id) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) throw new Error("Erro ao buscar livro");
    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao buscar livro ${id}:`, error);
    throw error;
  }
}

/**
 * 🔹 Cria ou atualiza um livro (apenas admin/superuser)
 */
export async function saveBook(book) {
  try {
    const { Authorization } = getAuthHeaders();
    const formData = new FormData();

    for (let key in book) {
      if (book[key] !== undefined && book[key] !== null) {
        formData.append(key, book[key]);
      }
    }

    const url = book.id ? `${API_URL}${book.id}/` : API_URL;
    const method = book.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { Authorization }, // ✅ Não incluir Content-Type para FormData
      body: formData,
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return saveBook(book);
    }

    if (!response.ok) throw new Error("Erro ao salvar livro");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao salvar livro:", error);
    throw error;
  }
}

/**
 * 🔹 Exclui um livro (somente admin/superuser)
 */
export async function deleteBook(id) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return deleteBook(id);
    }

    if (!response.ok) throw new Error("Erro ao deletar livro");
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar livro:", error);
    return false;
  }
}