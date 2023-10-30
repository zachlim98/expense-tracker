// components/ExpenseForm.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase'
import { addDoc, doc, collection, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

import { categories, subCategories } from './categories';

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
            setExpense(expenseDoc.data())
        }
      };
      fetchExpense();
    }
  }, [id])

  // constants for categories and subcategories
  const defaultExpense = { name: 'Both', 
  
  datetime: (() => {
    const current = new Date();
    const date = current.toISOString().slice(0, 10);  // gets YYYY-MM-DD
    const time = current.toTimeString().slice(0, 5);  // gets HH:MM
    return `${date}T${time}`;
})(), 
  description: '', amount: 0, category: 'Food', subCategory: 'Breakfast', card: 'UOB' }

  const [expense, setExpense] = useState(defaultExpense);
  
  // function to update category and subcategories
  const handeInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      let defaultSubcategory = '';
  
      switch(value) {
        case 'Food':
          defaultSubcategory = 'Breakfast';
          break;
        case 'Shopping':
          defaultSubcategory = 'Clothing'; // assuming 'clothing' as a subcategory for Shopping
          break;
        case 'Travel':
          defaultSubcategory = 'Transportation'; // assuming 'flight' as a subcategory for Travel
          break;
        default:
          break;
      }
  
      setExpense(prevExpense => ({
        ...prevExpense,
        [name]: value,
        subCategory: defaultSubcategory
      }));
    } else {
    setExpense(prevExpense => ({ ...prevExpense, [name]: value }));
  };}

  // Function for submitting the form and updating the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(expense.datetime)

      // Check for a positive amount
    if (parseFloat(expense.amount) <= 0 || isNaN(parseFloat(expense.amount))) {
      alert("Error: Please enter a positive amount.");
      return;
    }

    if (id) {
      await updateDoc(doc(db, "expenses", id), expense);
      navigate('/')
      alert("Expense updated!")
      setExpense(defaultExpense)
    } else {
      
    const docRef = await addDoc(collection(db, "expenses"), expense);
    alert("Expense added!") 
    setExpense(defaultExpense)
  }
    }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>
        {id ? 'Editing Previous Expense' : 'New Expense'}
        </h1>
      </div>
      <div>
        <label>Name: </label>
        <select value={expense.name} name="name" onChange={handeInputChange} required>
          <option value="Zach">Zach</option>
          <option value="Faith">Faith</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        <label> Date and Time: </label>
        <input type="datetime-local" name="datetime" value={expense.datetime} onChange={handeInputChange} />
      </div>
      <div>
        <label>Description: </label>
        <input value={expense.description} name="description" onChange={handeInputChange} />
      </div>
      <div>
        <label>Amount: </label>
        <input type="number" name="amount" value={expense.amount} onChange={handeInputChange} required />
      </div>
      <div>
        <label>Expense Category: </label>
        <select value={expense.category} name="category" onChange={handeInputChange}>
          {categories.map(cat => <option value={cat}> {cat} </option>)}
        </select>
      </div>
      <div>
        <label>Subcategory: </label>
        <select value={expense.subCategory} name="subCategory" onChange={handeInputChange}>
          {subCategories[expense.category] && subCategories[expense.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      <div>
        <label>Card Used: </label>
        <select value={expense.card} name="card" onChange={handeInputChange}>
          <option value="UOB">UOB</option>
          <option value="OCBC">OCBC</option>
          <option value="Citibank">Citibank</option>
          <option value="PayNow">PayNow</option>
        </select>
      </div>
      <button type="submit">{id ? 'Edit' : 'Add Expense'}</button>
    </form>
  );
}

export default ExpenseForm;
