// App.js

import React from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import CardUsage from "./components/CardUsage";
import "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { HamburgerMenu } from "./components/Misc/hamburger";
import { AppBar, Toolbar, Typography } from "@mui/material";

import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <HamburgerMenu />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Zach and Faith's Expense Tracker
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<ExpenseForm />} />

            <Route path="/addexpense" element={<ExpenseForm />} />

            <Route path="/expenselist" element={<ExpenseList />} />

            <Route path="/cardusage" element={<CardUsage />} />

            <Route path="edit/:id" element={<ExpenseForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
