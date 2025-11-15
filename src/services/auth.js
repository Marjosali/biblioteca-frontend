const API_URL = "http://127.0.0.1:8000/api/";

/* ========================================================
   🔹 LOGIN — Faz autenticação JWT e salva tokens no localStorage
   ======================================================== */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.detail || errorData.error || "Usuário ou senha inválidos.";
      throw new Error(msg);
    }

    const data = await response.json();

    // ✅ Salva tokens no localStorage
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // ✅ Decodifica o token para extrair informações do usuário
    const userInfo = decodeToken(data.access);
    localStorage.setItem("user_info", JSON.stringify(userInfo));

    return userInfo;
  } catch (error) {
    console.error("❌ Falha no login:", error.message);
    throw error;
  }
}

/* ========================================================
   🔹 REFRESH TOKEN — Atualiza o token de acesso
   ======================================================== */
export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const response = await fetch(`${API_URL}token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      console.warn("⚠️ Falha ao renovar token — sessão expirada.");
      logout();
      return null;
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      const userInfo = decodeToken(data.access);
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      return userInfo;
    }

    return null;
  } catch (error) {
    console.error("❌ Erro ao atualizar token:", error.message);
    logout();
    return null;
  }
}

/* ========================================================
   🔹 HEADERS — Retorna cabeçalhos com token JWT
   ======================================================== */
export function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ========================================================
   🔹 DECODE TOKEN — Lê dados do usuário do JWT
   ======================================================== */
export function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return {
      user_id: payload.user_id || null,
      username: payload.username || "",
      email: payload.email || "",
      is_staff: payload.is_staff || false,
      is_superuser: payload.is_superuser || false,
      exp: payload.exp || 0,
    };
  } catch (error) {
    console.error("❌ Erro ao decodificar token:", error.message);
    return null;
  }
}

/* ========================================================
   🔹 GET USER INFO — Retorna o usuário logado (do localStorage)
   ======================================================== */
export function getUserInfo() {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
}

/* ========================================================
   🔹 AUTH STATUS — Verifica se o token JWT ainda é válido
   ======================================================== */
export function isAuthenticated() {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

/* ========================================================
   🔹 LOGOUT — Limpa a sessão do usuário
   ======================================================== */
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");
}