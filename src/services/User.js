import { getAuthHeaders, refreshAccessToken, isAuthenticated } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/users/";

/**
 * 🔹 Lista todos os usuários (somente admin/superuser)
 */
export async function getUsers() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return getUsers();
    }

    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao listar usuários:", error);
    return [];
  }
}

/**
 * 🔹 Busca o perfil do usuário autenticado
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}me/`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return getCurrentUser();
    }

    if (!response.ok) throw new Error("Erro ao buscar usuário logado");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao obter usuário atual:", error);
    return null;
  }
}

/**
 * 🔹 Cria um novo usuário (admin/superuser ou público, dependendo da API)
 */
export async function createUser(userData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return createUser(userData);
    }

    if (!response.ok) throw new Error("Erro ao criar usuário");
    return await response.json();
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
    throw error;
  }
}

/**
 * 🔹 Atualiza dados de um usuário
 */
export async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return updateUser(id, userData);
    }

    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao atualizar usuário ${id}:`, error);
    throw error;
  }
}

/**
 * 🔹 Deleta um usuário (somente admin/superuser)
 */
export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.status === 401 && isAuthenticated()) {
      const newToken = await refreshAccessToken();
      if (newToken) return deleteUser(id);
    }

    if (!response.ok) throw new Error("Erro ao deletar usuário");
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);
    return false;
  }
}
