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

// Function that updates the total for each card if we need to update some value
exports.updateCardTotalOnExpenseEdit = functions.firestore
  .document("expenses/{expenseId}")
  .onUpdate(async (change, context) => {
    const previousExpense = change.before.data();
    const updatedExpense = change.after.data();

    const cardName = updatedExpense.card;
    const difference = updatedExpense.amount - previousExpense.amount;

    const cardTotalsRef = admin.firestore().collection("cardTotals");
    const cardTotalDoc = cardTotalsRef.doc(cardName);

    return cardTotalDoc.update({
      total: admin.firestore.FieldValue.increment(difference),
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
      "Zach:UOB": 1,
      "Zach:OCBC": 1,
      "Zach:Citibank": 20,
      "Faith:UOB": 4,
      "Faith:HSBC": 1,
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