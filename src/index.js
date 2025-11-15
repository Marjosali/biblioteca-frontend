import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // estilos globais
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";  // ✅ IMPORTANTE

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>      {/* 🔥 Envolve toda a aplicação */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Métricas (opcional)
reportWebVitals(console.log);
