// App.js

import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import { db } from './firebase';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div>
        {/* Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* Menu */}
        <div className={`menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/">Expense Form</Link>
          <Link to="/list">Expense List</Link>
        </div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={
          <ExpenseForm 
      editingExpense={editingExpense}
      setEditingExpense={setEditingExpense}
      />} />
          <Route path="/list" element={
          <ExpenseList expenses={expenses}
      setEditingExpense={setEditingExpense} />} />

          <Route path="edit/:id" element={
            <ExpenseForm 
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            />
          } />

        </Routes>
      </div>



    </Router>
  );
}

export default App;
