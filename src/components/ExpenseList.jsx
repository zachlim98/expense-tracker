// components/ExpenseList.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore'; // Import the required functions
import { useNavigate } from 'react-router-dom'


function ExpenseList({ setEditingExpense }) {

  const navigate = useNavigate();
  const [displayExp, setDisplayExp] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleEdit = (id) => {
    navigate(`/edit/${id}`)
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const fetchedExpenses = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDisplayExp(fetchedExpenses)
    };

    fetchExpenses();
  }, [])

  // function to render date properly
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

  // function to create filtering system
  const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
  };

  const filteredExpenses = displayExp.filter(expense => {
    if (!selectedMonth) return true;  // if no month is selected, show all expenses
    // Extract the month from the expense's date
    const expenseMonth = expense.datetime.split('-')[1];
    return expenseMonth === selectedMonth;
});



  return (
    <div>
      <h2>Expenses</h2>
      <label>Filter by Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">All</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="10">October</option>
        </select>
    <div className='responsive-table-container'>
      <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Amount</th>
                        <th>Card Used</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{formatDate(expense.datetime)}</td>
                            <td>{expense.category}</td>
                            <td>{expense.subCategory}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.card}</td>
                            <td>
                                <button onClick={() => handleEdit(expense.id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default ExpenseList;
