// components/ExpenseForm.js

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { addDoc, doc, collection, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
} from "@mui/material";

import { categories, subCategories } from "./Misc/categories";
import { AlertSnackbar } from "./Misc/SnackBar";
import { getFunctions, httpsCallable } from "firebase/functions";

function ExpenseForm() {
  // constants for ids and editing
  const { id } = useParams();
  const navigate = useNavigate();

  // functions to update if editing
  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        const expenseDoc = await getDoc(doc(db, "expenses", id));
        if (expenseDoc.exists()) {
          setExpense(expenseDoc.data());
        }
      };
      fetchExpense();
    }
  }, [id]);

  // functions for alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // constants for categories and subcategories
  const defaultExpense = {
    name: "Both",

    datetime: (() => {
      const current = new Date();
      const date = current.toISOString().slice(0, 10); // gets YYYY-MM-DD
      const time = current.toTimeString().slice(0, 5); // gets HH:MM
      return `${date}T${time}`;
    })(),
    description: "",
    amount: 0,
    category: "Food",
    subCategory: " ",
    card: "UOB",
  };

  const [expense, setExpense] = useState(defaultExpense);

  // function to update category and subcategories
  const handeInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      let defaultSubcategory = "";

      switch (value) {
      }

      setExpense((prevExpense) => ({
        ...prevExpense,
        [name]: value,
        subCategory: defaultSubcategory,
      }));
    } else {
      setExpense((prevExpense) => ({ ...prevExpense, [name]: value }));
    }
  };

  // Function for submitting the form and updating the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for a positive amount
    if (parseFloat(expense.amount) <= 0 || isNaN(parseFloat(expense.amount))) {
      setAlertMessage("Error: Please enter a positive amount.");
      setAlertOpen(true);
      return;
    }

    if (id) {
      await updateDoc(doc(db, "expenses", id), expense);
      setAlertMessage("Expense updated!");
      setAlertOpen(true);
      setExpense(defaultExpense);
      navigate("/addexpense");
    } else {
      const docRef = await addDoc(collection(db, "expenses"), expense);
      setAlertMessage("New expense added!");
      setAlertOpen(true);
      setExpense(defaultExpense);
      navigate("/addexpense");
    }
  };

  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.mode }}>
      <AlertSnackbar
        open={alertOpen}
        message={alertMessage}
        onClose={handleAlertClose}
      />
      <Box component="form" onSubmit={handleSubmit}>
        <Box>
          <h1>{id ? "Editing Previous Expense" : "New Expense"}</h1>
        </Box>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            select
            size="small"
            value={expense.name}
            name="name"
            onChange={handeInputChange}
            required
            label="Name:"
          >
            <MenuItem value="Zach">Zach</MenuItem>
            <MenuItem value="Faith">Faith</MenuItem>
            <MenuItem value="Both">Both</MenuItem>
          </TextField>
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            type="datetime-local"
            name="datetime"
            value={expense.datetime}
            onChange={handeInputChange}
            required
            label="Date and Time:"
          />
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            value={expense.description}
            name="description"
            onChange={handeInputChange}
            label="Description:"
          />
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handeInputChange}
            required
            label="Amount:"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            select
            value={expense.category}
            name="category"
            onChange={handeInputChange}
            label="Category: "
          >
            {categories.map((cat) => (
              <MenuItem value={cat}> {cat} </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            select
            value={expense.subCategory}
            name="subCategory"
            onChange={handeInputChange}
            label="Subcategory:"
          >
            {subCategories[expense.category] &&
              subCategories[expense.category].map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl fullWidth sx={{ padding: "0 16px" }}>
          <TextField
            select
            value={expense.card}
            name="card"
            onChange={handeInputChange}
            label="Card:"
          >
            <MenuItem value="UOB">UOB</MenuItem>
            <MenuItem value="OCBC">OCBC</MenuItem>
            <MenuItem value="Citibank">Citibank</MenuItem>
            <MenuItem value="PayNow">PayNow</MenuItem>
          </TextField>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          {id ? "Edit" : "Add Expense"}
        </Button>
      </Box>
    </Box>
  );
}

export default ExpenseForm;
