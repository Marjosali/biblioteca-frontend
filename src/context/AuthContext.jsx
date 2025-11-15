import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  refreshToken,
} from "../Api";
import { USER_ROLES } from "../constants/userRoles";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(USER_ROLES.GUEST);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setRole(USER_ROLES.GUEST);
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      if (!userData) {
        setLoading(false);
        return;
      }

      setUser(userData);
      setRole(
        userData.is_superuser
          ? USER_ROLES.SUPERUSER
          : userData.is_staff
          ? USER_ROLES.ADMIN
          : USER_ROLES.USER
      );
    } catch {
      console.error("Erro ao carregar usuário");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(username, password) {
    await apiLogin(username, password);
    await loadUser();
  }

  function handleLogout() {
    apiLogout();
    setUser(null);
    setRole(USER_ROLES.GUEST);
  }

  // Carrega usuário ao abrir o app
  useEffect(() => {
    loadUser();
  }, []);

  // Atualiza token periodicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshToken();
      await loadUser();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
