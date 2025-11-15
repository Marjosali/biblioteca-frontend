import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

/**
 * Registra métricas de performance e envia para Google Analytics via gtag().
 * @param {function} onPerfEntry - Função callback que recebe as métricas.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;