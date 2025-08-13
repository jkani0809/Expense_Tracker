import React, { useState } from "react";

export default function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", amount: "", category: "" });

  const handleEdit = (exp) => {
    setEditId(exp.id);
    setEditData(exp);
  };

  const saveEdit = () => {
    onUpdate(editId, { ...editData, amount: parseFloat(editData.amount) });
    setEditId(null);
  };

  return (
    <div>
      <h3>Expenses</h3>
      {expenses.length === 0 && <p>No expenses yet</p>}
      {expenses.map((exp) =>
        editId === exp.id ? (
          <div key={exp.id}>
            <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
            <input value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} />
            <input value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
            <button onClick={saveEdit}>Save</button>
          </div>
        ) : (
          <div key={exp.id}>
            {exp.title} - ${exp.amount} ({exp.category})
            <button onClick={() => handleEdit(exp)}>Edit</button>
            <button onClick={() => onDelete(exp.id)}>Delete</button>
          </div>
        )
      )}
    </div>
  );
}
