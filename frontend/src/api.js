// Users API (Local Backend)
const USERS_URL = "http://localhost:5000/users";

// Transactions API (MockAPI)
const TRANSACTIONS_URL = "https://689b5ae9596febe35a27aa17.mockapi.io/transactions";

// Users
export const getUsers = () => fetch(USERS_URL).then(res => res.json());

export const addUser = (user) =>
  fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => res.json());

// Transactions
export const getTransactions = () => fetch(TRANSACTIONS_URL).then(res => res.json());

export const addTransaction = (txn) =>
  fetch(TRANSACTIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(txn),
  }).then(res => res.json());

export const updateTransaction = (id, txn) =>
  fetch(`${TRANSACTIONS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(txn),
  }).then(res => res.json());

export const deleteTransaction = (id) =>
  fetch(`${TRANSACTIONS_URL}/${id}`, { method: "DELETE" });
