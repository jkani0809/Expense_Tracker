import React from "react";

export default function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return <h3>Total: ${total.toFixed(2)}</h3>;
}
