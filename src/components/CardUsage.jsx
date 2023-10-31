import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../firebase";

function CardTotalsPage() {
  const [cardTotal, setCardTotal] = useState([]);

  useEffect(() => {
    const fetchCard = async () => {
      const querySnapshot = await getDocs(collection(db, "cardTotals"));
      const fetchedExpenses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(fetchedExpenses);
      setCardTotal(fetchedExpenses);
    };

    fetchCard();
  }, []);

  return (
    <div>
      <h2>Total Card Expenses</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Card Name</TableCell>
            {/* <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell> */}
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cardTotal.map((total) => (
            <TableRow key={total.id}>
              <TableCell>{total.id}</TableCell>
              {/* <TableCell>{total.startDate}</TableCell>
            <TableCell>{total.endDate}</TableCell> */}
              <TableCell>${total.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CardTotalsPage;
