// components/ExpenseList.js

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; // Import the required functions
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TextField,
  MenuItem,
  TableBody,
} from "@mui/material";
import { months } from "./Misc/categories";

function ExpenseList({ setEditingExpense }) {
  const navigate = useNavigate();
  const [displayExp, setDisplayExp] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // functions to fetch the data and then sort by date
  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, "expenses"));
      const fetchedExpenses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDisplayExp(fetchedExpenses);
    };

    fetchExpenses();
  }, []);

  const sortedExpenses = displayExp.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB - dateA; // For descending order
  });

  // function to render date properly
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // function to render card used
  function formatcard(card) {
    const splitcard = card.split(":");
    if (splitcard.length > 1) {
      return splitcard[1];
    }
    return null;
  }

  // function to create filtering system
  const handleMonthChange = (e) => {
    setSelectedMonth(e);
  };

  const filteredExpenses = sortedExpenses.filter((expense) => {
    if (!selectedMonth) return true; // if no month is selected, show all expenses
    // Extract the month from the expense's date
    const expenseMonth = expense.datetime.split("-")[1];
    return expenseMonth === selectedMonth;
  });

  return (
    <div>
      <h2>Expenses</h2>
      <TextField
        select
        label="Filter by Month"
        value={selectedMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        fullWidth
        sx={{ padding: "0 10px" }}
      >
        {months.map((month, index) => {
          const monthValue = (index + 1).toString().padStart(2, "0");
          return (
            <MenuItem key={index} value={monthValue}>
              {month}
            </MenuItem>
          );
        })}
      </TextField>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Card Used</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{formatDate(expense.datetime)}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.subCategory}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{formatcard(expense.card)}</TableCell>
                <TableCell>
                  <button onClick={() => handleEdit(expense.id)}>Edit</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ExpenseList;
