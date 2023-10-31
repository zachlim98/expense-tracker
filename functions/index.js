const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Function that updates the card totals every time we add a new expense
exports.updateCardTotalOnNewExpense = functions.firestore
  .document("expenses/{expenseId}")
  .onCreate(async (snapshot, context) => {
    const newExpense = snapshot.data();
    const cardName = newExpense.card;
    const amount = newExpense.amount;

    const cardTotalsRef = admin.firestore().collection("cardTotals");
    const cardTotalDoc = cardTotalsRef.doc(cardName);

    // Increase the total for this card
    return cardTotalDoc.update({
      total: admin.firestore.FieldValue.increment(parseFloat(amount)),
    });
  });

// Function that resets the totals. It is checked at the end of every day
exports.resetCardTotals = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    const db = admin.firestore();
    const cardTotalsRef = db.collection("cardTotals");

    // Define the cards and their reset dates
    const cardResetDates = {
      UOB: 2,
      OCBC: 5,
      // ... other cards and their reset dates
    };

    const today = new Date().getDate();

    for (const [cardName, resetDay] of Object.entries(cardResetDates)) {
      if (today === resetDay) {
        // If today is the reset day for this card, reset its total to 0
        await cardTotalsRef.doc(cardName).update({
          total: 0,
        });
      }
    }
    return null; // Successful execution
  });
