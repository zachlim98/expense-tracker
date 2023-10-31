import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import { getDocs, collection, where, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function SimpleCharts() {
  const [displayExp, setDisplayExp] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      // 1. Format the start and end dates of the current month.
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const startofNextMonth = new Date(
        endOfMonth.setDate(endOfMonth.getDate() + 1)
      );

      const formatToFirestoreDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}T00:00`;
      };

      const formattedStart = formatToFirestoreDate(startOfMonth);
      const formattedEnd = formatToFirestoreDate(startofNextMonth);

      console.log(formattedStart, formattedEnd);

      // 2. Use the where function to add conditions to the Firestore query.
      const expensesQuery = query(
        collection(db, "expenses"),
        where("datetime", ">=", formattedStart),
        where("datetime", "<=", formattedEnd),
        orderBy("datetime") // It's important to order by the field you're querying on.
      );

      const querySnapshot = await getDocs(expensesQuery);
      const fetchedExpenses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDisplayExp(fetchedExpenses);
    };

    fetchExpenses();
  }, []);

  const [chartWidth, setChartWidth] = useState(
    window.innerWidth < 768 ? window.innerWidth - 40 : 500
  );
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartWidth(window.innerWidth - 40); // 20px padding on each side for smaller screens
        setChartHeight(200); // reduce height for mobile devices
      } else {
        setChartWidth(500);
        setChartHeight(300);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let total = 0;
    const categoryMap = {};

    displayExp.forEach((expense) => {
      total += parseFloat(expense.amount) || 0; // Assuming each expense has an 'amount' field

      if (expense.category) {
        categoryMap[expense.category] =
          (categoryMap[expense.category] || 0) +
          (parseFloat(expense.amount) || 0);
      }
    });

    const sortedCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    setTotalSpent(total);
    setTopCategories(sortedCategories);
  }, [displayExp]);

  const categoryLabels = topCategories.map((cat) => cat[0]);
  const categoryValues = topCategories.map((cat) => cat[1]);

  return (
    <Box padding="10px">
      <BarChart
        title="Top 3 categories"
        xAxis={[
          {
            id: "barCategories",
            data: ["Does", "Not work"],
            scaleType: "band",
          },
        ]}
        series={[
          {
            data: [1, 3],
          },
        ]}
        width={chartWidth}
        height={chartHeight}
      />
      <Typography>Total Spent this month: ${totalSpent}</Typography>
    </Box>
  );
}
