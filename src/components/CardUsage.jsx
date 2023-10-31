import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
      setCardTotal(fetchedExpenses);
    };

    fetchCard();
  }, []);

  const zachCards = cardTotal.filter(
    (card) => card.id.split(":")[0] === "Zach"
  );
  const faithCards = cardTotal.filter(
    (card) => card.id.split(":")[0] === "Faith"
  );

  return (
    <Box>
      <Typography variant="h5"> Card Usage for the Cycle </Typography>
      <br></br>
      <Typography variant="h6">Faith's Cards</Typography>
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
          {faithCards.map((total) => (
            <TableRow key={total.id}>
              <TableCell>{total.id.split(":")[1]}</TableCell>
              {/* <TableCell>{total.startDate}</TableCell>
            <TableCell>{total.endDate}</TableCell> */}
              <TableCell>${total.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br></br>
      <Typography variant="h6">Zach's Cards</Typography>
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
          {zachCards.map((total) => (
            <TableRow key={total.id}>
              <TableCell>{total.id.split(":")[1]}</TableCell>
              {/* <TableCell>{total.startDate}</TableCell>
            <TableCell>{total.endDate}</TableCell> */}
              <TableCell>${total.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default CardTotalsPage;
