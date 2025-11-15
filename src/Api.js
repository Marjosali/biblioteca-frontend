const API_URL = "http://127.0.0.1:8000/api/";

/* =====================================================
   🔹 Cabeçalhos de Autenticação
   ===================================================== */
export function getAuthHeaders(contentType = "application/json") {
  const token = localStorage.getItem("access_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": contentType }
    : { "Content-Type": contentType };
}

/* =====================================================
   🔹 Tratamento de erro e renovação de token
   ===================================================== */
async function handleProtectedRequest(url, options = {}) {
  let response = await fetch(url, options);

  if (response.status === 401) {
    const newToken = await refreshToken();
    if (!newToken) throw new Error("Sessão expirada. Faça login novamente.");

    options.headers = getAuthHeaders(options.headers?.["Content-Type"]);
    response = await fetch(url, options);
  }

  return response;
}

/* =====================================================
   🔹 Autenticação JWT
   ===================================================== */
export async function login(username, password) {
  const response = await fetch(`${API_URL}token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Usuário ou senha incorretos");

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  const response = await fetch(`${API_URL}token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    logout();
    return null;
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

/* =====================================================
   🔹 Usuário atual
   ===================================================== */
export async function getCurrentUser() {
  let response = await handleProtectedRequest(`${API_URL}users/me/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  localStorage.setItem("user_info", JSON.stringify(data));
  return data;
}

/* =====================================================
   🔹 Usuários
   ===================================================== */
export async function getUsers() {
  const response = await handleProtectedRequest(`${API_URL}users/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createUser(userData) {
  const response = await handleProtectedRequest(`${API_URL}users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok)
    throw new Error(`Erro ao criar usuário: ${await response.text()}`);

  return response.json();
}

export async function deleteUser(userId) {
  const response = await handleProtectedRequest(`${API_URL}users/${userId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok)
    throw new Error(`Erro ao deletar usuário: ${await response.text()}`);

  return true;
}

/* =====================================================
   🔹 Livros
   ===================================================== */
export async function getBooks() {
  const response = await handleProtectedRequest(`${API_URL}books/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createBook(formData) {
  const token = localStorage.getItem("access_token");

  const response = await handleProtectedRequest(`${API_URL}books/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok)
    throw new Error(`Erro ao cadastrar livro: ${await response.text()}`);

  return response.json();
}

/* =====================================================
   🔹 Empréstimos
   ===================================================== */
export async function getLoans() {
  const response = await handleProtectedRequest(`${API_URL}loans/`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createLoan(loanData) {
  const response = await handleProtectedRequest(`${API_URL}loans/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(loanData), // { book_id, user_id, turma }
  });

  if (!response.ok)
    throw new Error(`Erro ao registrar empréstimo: ${await response.text()}`);

  return response.json();
}

/* =====================================================
   🔹 Devolução de livro (endpoint customizado)
   ===================================================== */
export async function returnBook(loanId) {
  const response = await handleProtectedRequest(`${API_URL}loans/${loanId}/devolver/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok)
    throw new Error(`Erro ao registrar devolução: ${await response.text()}`);

  return response.json();
}