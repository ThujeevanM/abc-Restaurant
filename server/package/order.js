const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");


  
router.post('/orders', (req, res) => {
    // Extract data from request body
    const { menu_item_id, user_id, quantity, total_amount, order_type, customer } = req.body;

    Db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to start transaction' });
        }

        // Insert into orders table
        const orderQuery = 'INSERT INTO orders (menu_item_id, user_id, quantity, total_amount, order_type) VALUES (?, ?, ?, ?, ?)';
        const orderValues = [menu_item_id, user_id, quantity, total_amount, order_type];

        Db.query(orderQuery, orderValues, (err, orderResult) => {
            if (err) {
                return Db.rollback(() => {
                    console.error('Error inserting order:', err);
                    res.status(500).json({ error: 'Failed to insert order' });
                });
            } 

            const orderId = orderResult.insertId;

            // If the order type is 'delivery', insert into deliveries table
            if (order_type === 'delivery') {
                const { city, street_address, postal_code, payment_type, phone, name } = customer;
                const deliveryQuery = 'INSERT INTO deliveries (order_id, city, street_address, postal_code, payment_type, phone_nb, name) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const deliveryValues = [orderId, city, street_address, postal_code, payment_type, phone, name];

                Db.query(deliveryQuery, deliveryValues, (err) => {
                    if (err) {
                        return Db.rollback(() => {
                            console.error('Error inserting delivery:', err);

                            // Rollback the order insertion as well
                            Db.query('DELETE FROM orders WHERE orderid = ?', [orderId], (err) => {
                                if (err) {
                                    console.error('Error rolling back order:', err);
                                }
                                res.status(500).json({ error: 'Failed to insert delivery. Order has been rolled back.' });
                            });
                        });
                    } else {
                        // Commit the transaction
                        Db.commit((err) => {
                            if (err) {
                                return Db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    res.status(500).json({ error: 'Failed to commit transaction' });
                                });
                            }

                            res.status(201).json({ message: 'Order created successfully' });
                        });
                    }
                });
            } else {
                // Commit the transaction if not delivery
                Db.commit((err) => {
                    if (err) {
                        return Db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            res.status(500).json({ error: 'Failed to commit transaction' });
                        });
                    }

                    res.status(201).json({ message: 'Order created successfully' });
                });
            }
        });
    });
});

router.get('/orders/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
      SELECT o.orderid, o.menu_item_id, o.user_id, o.quantity, o.total_amount, o.order_type, o.order_date, o.order_status, 
             m.name AS item_name, m.description AS item_description, m.img AS item_image, m.price AS item_price 
      FROM orders o 
      JOIN menu_items m ON o.menu_item_id = m.food_id 
      WHERE o.user_id = ?
    `;
  
    // Execute the query with user_id as the parameter
    Db.query(query, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
    
        // Convert image data to Base64 format
        const resultsWithBase64Images = results.map((items) => ({
          ...items,
          item_image: items.item_image
            ? `data:image/jpeg;base64,${Buffer.from(items.item_image).toString('base64')}`
            : null,
        }));
    
        res.json(resultsWithBase64Images);
      });
  });
  

  router.delete('/delete/:orderId', (req, res) => {
    const orderId = req.params.orderId;
  
    // Step 1: Check if the order is a delivery
    const checkOrderQuery = 'SELECT order_type FROM orders WHERE orderid = ?';
    
    Db.query(checkOrderQuery, [orderId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      const orderType = results[0].order_type;
  
      if (orderType === 'delivery') {
        // Step 2: Delete associated delivery details
        const deleteDeliveryQuery = 'DELETE FROM deliveries WHERE order_id = ?';
        Db.query(deleteDeliveryQuery, [orderId], (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          // Step 3: Delete the order
          const deleteOrderQuery = 'DELETE FROM orders WHERE orderid = ?';
          Db.query(deleteOrderQuery, [orderId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
  
            res.status(200).json({ message: 'Order and associated delivery details deleted successfully' });
          });
        });
      } else {
        // If not a delivery, just delete the order
        const deleteOrderQuery = 'DELETE FROM orders WHERE orderid = ?';
        Db.query(deleteOrderQuery, [orderId], (err) => {
          if (err) return res.status(500).json({ error: err.message });
  
          res.status(200).json({ message: 'Order deleted successfully' });
        });
      }
    });
  });
  
  


module.exports = router;








  
  
  
  
  
  
  






// router.post('/orders', (req, res) => {
//     const { menu_item_id, user_id, quantity, total_amount, order_type } = req.body;
  
//     // Validation (simple example)
//     if (!menu_item_id || !user_id || !quantity || !total_amount || !order_type) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
  
//     const query = `
//       INSERT INTO orders (menu_item_id, user_id, quantity, total_amount, order_type)
//       VALUES (?, ?, ?, ?, ?)
//     `;
  
//     Db.query(query, [menu_item_id, user_id, quantity, total_amount, order_type], (err, result) => {
//       if (err) {
//         console.error('Error inserting order:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
  
//       res.status(201).json({ message: 'Order placed successfully', orderId: result.insertId });
//     });
//   });
  




  