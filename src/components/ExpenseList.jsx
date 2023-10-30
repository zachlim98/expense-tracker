// components/ExpenseList.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore'; // Import the required functions
import { useNavigate } from 'react-router-dom'


function ExpenseList({ setEditingExpense }) {

  const navigate = useNavigate();
  const [displayExp, setDisplayExp] = useState([]);

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

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {displayExp.map((displayExp) => (
          <li key={displayExp.id}>
            {displayExp.name} - ${parseFloat(displayExp.amount).toFixed(2)} | {displayExp.card}
            <button onClick={() => handleEdit(displayExp.id)}> Edit </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
