// src/components/AccessibilityBar.js
import React, { useState, useEffect } from "react";
import "../assets/styles.css";

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  // Carregar preferências do localStorage ao iniciar
  useEffect(() => {
    const savedFont = localStorage.getItem("fontSize");
    const savedContrast = localStorage.getItem("highContrast") === "true";

    if (savedFont) setFontSize(parseInt(savedFont, 10));
    if (savedContrast) setHighContrast(true);

    document.body.style.fontSize = `${savedFont || 16}px`;
    if (savedContrast) document.body.classList.add("high-contrast");
  }, []);

  // Aumentar fonte
  const increaseFont = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  // Diminuir fonte
  const decreaseFont = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  // Alternar alto contraste
  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem("highContrast", newContrast);
    document.body.classList.toggle("high-contrast", newContrast);
  };

  return (
    <div
      className="accessibility-bar"
      role="region"
      aria-label="Barra de acessibilidade"
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "#f1f1f1",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <button
        onClick={increaseFont}
        aria-label="Aumentar tamanho da fonte"
        title="Aumentar fonte"
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: "#004999",
          color: "#fff",
          fontWeight: "bold",
          transition: "0.2s",
        }}
      >
        A+
      </button>

      <button
        onClick={decreaseFont}
        aria-label="Diminuir tamanho da fonte"
        title="Diminuir fonte"
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: "#004999",
          color: "#fff",
          fontWeight: "bold",
          transition: "0.2s",
        }}
      >
        A-
      </button>

      <button
        onClick={toggleContrast}
        aria-label="Alternar alto contraste"
        title="Alto contraste"
        style={{
          padding: "5px 10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: highContrast ? "#222" : "#007bff",
          color: "#fff",
          fontWeight: "bold",
          transition: "0.2s",
        }}
      >
        ♿ Contraste
      </button>
    </div>
  );
}
