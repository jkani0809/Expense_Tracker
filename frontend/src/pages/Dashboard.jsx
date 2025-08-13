import React, { useState, useEffect } from "react";
import "./dashboard.css";

const API_URL = "http://localhost:5000/api/details";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "Expense",
    description: "",
    amount: "",
    category: "Food",
  });
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...formData, amount: parseFloat(formData.amount), date: new Date().toLocaleString() };

    if (editingId) {
      fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      })
        .then((res) => res.json())
        .then((updated) => {
          setTransactions(transactions.map((t) => (t.id === editingId ? updated : t)));
          setEditingId(null);
        });
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      })
        .then((res) => res.json())
        .then((saved) => setTransactions([...transactions, saved]));
    }

    setFormData({ type: "Expense", description: "", amount: "", category: "Food" });
  };

  const handleEdit = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setFormData(transaction);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setTransactions(transactions.filter((t) => t.id !== id)));
  };

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === "All" || t.type === filterType;
    const categoryMatch = filterCategory === "All" || t.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <header className="header">
          <h1>Expense Tracker</h1>
          <p>Track your income & expenses</p>
        </header>

        <section className="balance-section">
          <div className="balance-card">
            <h3>Current Balance</h3>
            <p className="amount">₹ {balance.toFixed(2)}</p>
          </div>
          <div className="balance-card income">
            <h3>Total Income</h3>
            <p className="amount green">₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="balance-card expense">
            <h3>Total Expense</h3>
            <p className="amount red">₹ {totalExpense.toFixed(2)}</p>
          </div>
        </section>

        <section className="main-section">
          <div className="form-section">
            <h2>{editingId ? "Update" : "Add"} Expense / Income</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Type
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option>Expense</option>
                  <option>Income</option>
                </select>
              </label>
              <label>
                Description
                <input
                  name="description"
                  type="text"
                  placeholder="e.g., Grocery, Salary"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Amount (₹)
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Category
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Groceries</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                </select>
              </label>
              <button type="submit">{editingId ? "Update" : "Add"}</button>
            </form>
          </div>

          <div className="table-section">
            <h2>Expenses & Incomes</h2>
            <div className="filters">
              <label>
                Filter by Type:
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option>All</option>
                  <option>Expense</option>
                  <option>Income</option>
                </select>
              </label>
              <label>
                Filter by Category:
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option>All</option>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Groceries</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                </select>
              </label>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-msg">No transactions found — add one!</td>
                  </tr>
                ) : (
                  currentItems.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>{t.category}</td>
                      <td>{t.type}</td>
                      <td>₹ {parseFloat(t.amount).toFixed(2)}</td>
                      <td>
                        <button onClick={() => handleEdit(t.id)}>Edit</button>
                        <button onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
