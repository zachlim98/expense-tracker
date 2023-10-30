// components/ExpenseForm.js

import React, { useState, useEffect } from 'react';

function ExpenseForm({ addExpense, editingExpense, setEditingExpense, expenses, setExpenses }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('Food');
  const [subCategory, setSubCategoryState] = useState('Breakfast');
  const [card, setCard] = useState('UOB');

  const subCategories = {
    Food: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drinks'],
    Shopping: ['Clothing', 'Electronics', 'Groceries', 'Accessories', 'Home & Living'],
    Travel: ['Transportation', 'Accommodation', 'Tours & Activities', 'Dining Out', 'Souvenirs']
  };

  const handleSubmit = e => {
    e.preventDefault();

      // Check for a positive amount
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      alert("Error: Please enter a positive amount.");
      return;
    }

    if (editingExpense) {
      const updatedExpenses = expenses.map(exp => {
        if (exp === editingExpense) {
          return {name, amount: parseFloat(amount), category, subCategory, card};
        }
        return exp;
      });
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } else {

    addExpense({ name, amount: parseFloat(amount) || 0 , category, subCategory, card});
    setName('');
    setAmount('');
    setCategory('Food');
    setSubCategoryState('Breakfast');
    setCard('PayNow');
    }
  };

  useEffect(() => {
    // Reset subcategory when main category changes
    setSubCategoryState(subCategories[category][0]);
  }, [category]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Amount: </label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>
      <div>
        <label>Expense Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
        </select>
      </div>
      <div>
        <label>Subcategory: </label>
        <select value={subCategory} onChange={e => setSubCategoryState(e.target.value)}>
          {subCategories[category] && subCategories[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      <div>
        <label>Card Used: </label>
        <select value={card} onChange={e => setCard(e.target.value)}>
          <option value="UOB">UOB</option>
          <option value="OCBC">OCBC</option>
          <option value="Citibank">Citibank</option>
          <option value="PayNow">PayNow</option>
        </select>
      </div>
      <button type="submit">{editingExpense ? 'Edit' : 'Add Expense'}</button>
    </form>
  );
}

export default ExpenseForm;
