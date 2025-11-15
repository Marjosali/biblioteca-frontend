import { getAuthHeaders, refreshAccessToken, isAuthenticated } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/loans/";

/**
 * 🔹 Lista todos os empréstimos
 */
export async function getLoans() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return getLoans();
    }

    if (!response.ok) throw new Error("Erro ao buscar empréstimos");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao listar empréstimos:", error);
    return [];
  }
}

/**
 * 🔹 Cria um novo empréstimo
 */
export async function createLoan(loanData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(loanData),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return createLoan(loanData);
    }

    if (!response.ok) throw new Error("Erro ao criar empréstimo");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao criar empréstimo:", error);
    throw error;
  }
}

/**
 * 🔹 Atualiza um empréstimo (ex.: marcar devolução)
 */
export async function updateLoan(id, updatedData) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "PATCH", // ✅ Melhor usar PATCH para atualização parcial
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updatedData),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return updateLoan(id, updatedData);
    }

    if (!response.ok) throw new Error("Erro ao atualizar empréstimo");
    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao atualizar empréstimo ${id}:`, error);
    throw error;
  }
}

/**
 * 🔹 Deleta um empréstimo (somente admin/superuser)
 */
export async function deleteLoan(id) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return deleteLoan(id);
    }

    if (!response.ok) throw new Error("Erro ao deletar empréstimo");
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar empréstimo:", error);
    return false;
  }
}

/**
 * 🔹 Marca um empréstimo como devolvido
 */
export async function returnLoan(id) {
  try {
    return await updateLoan(id, { returned: true });
  } catch (error) {
    console.error("❌ Erro ao marcar devolução:", error);
    throw error;
  }
}