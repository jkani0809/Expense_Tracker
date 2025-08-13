import React, { useState } from "react";

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && amount && category) {
      onAdd({ title, amount: parseFloat(amount), category });
      setTitle("");
      setAmount("");
      setCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input value={amount} placeholder="Amount" type="number" onChange={(e) => setAmount(e.target.value)} />
      <input value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <button type="submit">Add Expense</button>
    </form>
  );
}
