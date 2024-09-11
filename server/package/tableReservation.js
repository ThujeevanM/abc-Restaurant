const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");



router.post("/reservation-payment", async (req, res) => {
    const { user_id, table_id, reservation_date, no_members, status, amount, paymentMethod, card_number, expiry_date, cvv } = req.body;
  
    // Start a transaction
    Db.beginTransaction(async (transactionError) => {
      if (transactionError) {
        console.error("Transaction error: ", transactionError);
        return res.status(500).json({ error: "Transaction initialization failed" });
      }
  
      try {
        // Step 1: Insert into reservation table
        const reservationQuery = `
          INSERT INTO reservation (user_id, table_id, reservation_date, no_members, status, amount)
          VALUES (?, ?, ?, ?, ?, ?)`;
        Db.query(reservationQuery, [
          user_id,
          table_id,
          reservation_date,
          no_members,
          status, // Initially set this to something like 'pending'
          amount
        ], (err, reservationResult) => {
          if (err) {
            return Db.rollback(() => {
              console.error("Error inserting reservation: ", err);
              res.status(500).json({ error: "Failed to create reservation" });
            });
          }
  
          const reservation_id = reservationResult.insertId;
  
          // Step 2: Insert into payment table using the reservation_id
          const paymentQuery = `
            INSERT INTO payments (user_id, reservation_id, amount, payment_method, card_number, expiry_date, cvv, transaction_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'successful')`;
          Db.query(paymentQuery, [
            user_id,
            reservation_id,
            amount,
            paymentMethod,
            card_number,
            expiry_date,
            cvv
          ], (paymentError) => {
            if (paymentError) {
              return Db.rollback(() => {
                console.error("Error inserting payment: ", paymentError);
                res.status(500).json({ error: "Failed to process payment" });
              });
            }
  
            // Step 3: Update the `dining_tables` table to set `status` as "reserved"
            const updateTableQuery = `
              UPDATE dining_tables
              SET status = 'reserved'
              WHERE table_id = ?`;
            Db.query(updateTableQuery, [table_id], (tableUpdateError) => {
              if (tableUpdateError) {
                return Db.rollback(() => {
                  console.error("Error updating table status: ", tableUpdateError);
                  res.status(500).json({ error: "Failed to update table status" });
                });
              }
  
              // Step 4: Update the `reservation` table's `status` to "completed"
              const updateReservationStatusQuery = `
                UPDATE reservation
                SET status = 'completed'
                WHERE reservation_id = ?`;
              Db.query(updateReservationStatusQuery, [reservation_id], (reservationUpdateError) => {
                if (reservationUpdateError) {
                  return Db.rollback(() => {
                    console.error("Error updating reservation status: ", reservationUpdateError);
                    res.status(500).json({ error: "Failed to update reservation status" });
                  });
                }
  
                // Step 5: Commit the transaction
                Db.commit((commitError) => {
                  if (commitError) {
                    return Db.rollback(() => {
                      console.error("Transaction commit error: ", commitError);
                      res.status(500).json({ error: "Failed to commit transaction" });
                    });
                  }
  
                  // Success response
                  res.status(201).json({ message: "Reservation and Payment successfully created", reservation_id });
                });
              });
            });
          });
        });
      } catch (error) {
        Db.rollback(() => {
          console.error("Error during transaction: ", error);
          res.status(500).json({ error: "Failed to create reservation or process payment" });
        });
      }
    });
  });

  router.get("/reservations/:user_id", (req, res) => {
    const userId = req.params.user_id;

    // SQL query to get reservations along with table details
    const query = `
        SELECT r.reservation_id, r.user_id, r.table_id, r.reservation_date, r.no_members, r.status AS reservation_status, r.amount, 
               t.table_number, t.seats, t.location, t.status AS table_status, 
               t.image AS table_image, t.price
        FROM reservation r
        INNER JOIN dining_tables t ON r.table_id = t.table_id
        WHERE r.user_id = ?`;

    Db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching reservations: ", err);
            return res.status(500).json({ error: "Failed to fetch reservations" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No reservations found for this user" });
        }

        // Convert image to base64
        const resultsWithBase64Image = results.map(row => {
            if (row.table_image) {
                row.table_image = `data:image/jpeg;base64,${Buffer.from(row.table_image).toString('base64')}`;
            }
            return row;
        });

        res.status(200).json(resultsWithBase64Image);
    });
});

  module.exports = router;