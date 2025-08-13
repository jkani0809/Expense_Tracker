import React from "react";

export default function ExpenseFilter({ onFilterChange }) {
  return (
    <div>
      <input placeholder="Filter by category" onChange={(e) => onFilterChange(e.target.value)} />
    </div>
  );
}
