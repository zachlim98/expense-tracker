// App.js

import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(false);

  const addExpense = (expense) => {
    const totalForCard = expenses
      .filter(e => e.card === expense.card)
      .reduce((sum, e) => sum + e.amount, 0);

    if (totalForCard + expense.amount > 1000) {
      alert("You've spent more than $1000 on this card. Consider using a different card.");
      return; // Don't add the expense to prevent going over the limit
    }

    setExpenses(prevExpenses => [...prevExpenses, expense]);
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <ExpenseForm 
      addExpense={addExpense}
      editingExpense={editingExpense}
      setEditingExpense={setEditingExpense}
      expenses={expenses}
      setExpenses={setExpenses}
      />
      <ExpenseList expenses={expenses}
      setEditingExpense={setEditingExpense} />
    </div>
  );
}

export default App;
