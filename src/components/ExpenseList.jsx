// components/ExpenseList.js

import React from 'react';

function ExpenseList({ expenses, setEditingExpense }) {
  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name} - ${expense.amount.toFixed(2)} | {expense.card}
            <button onClick={() => setEditingExpense(expense)}> Edit </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
