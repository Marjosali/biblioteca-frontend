import React from "react";
import LoanList from "../components/LoanList";

export default function MyLoans() {
  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#004999" }}>
        Meus Empréstimos
      </h1>
      <LoanList />
    </div>
  );
}

