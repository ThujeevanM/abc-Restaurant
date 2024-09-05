const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");

// Helper function to convert binary data (Buffer) to Base64
const toBase64 = (buffer) => {
  return buffer && Buffer.isBuffer(buffer)
    ? `data:image/jpeg;base64,${buffer.toString('base64')}`
    : null;
};

// GET /dining-tables
router.get('/', (req, res) => {
  const query = `
    SELECT 
      dt.table_id, 
      dt.restaurant_id, 
      dt.table_number, 
      dt.seats, 
      dt.location,
      dt.price, 
      dt.status, 
      dt.image AS table_image, 
      r.city, 
      r.phone_number, 
      r.email, 
      r.opening_hours, 
      r.district, 
      r.img AS restaurant_image
    FROM dining_tables dt
    JOIN restaurant r ON dt.restaurant_id = r.restaurant_id
  `;

  Db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Convert images to Base64
    const resultsWithBase64Images = results.map((item) => ({
      ...item,
      table_image: toBase64(item.table_image),
      restaurant_image: toBase64(item.restaurant_image)
    }));

    res.json(resultsWithBase64Images);
  });
});

router.get('/table/:restaurant_id', (req, res) => {
    const { restaurant_id } = req.params;
  
    // SQL query to select dining tables by restaurant_id
    const query = `
      SELECT 
        dt.table_id, 
        dt.restaurant_id, 
        dt.table_number, 
        dt.seats,
        dt.price, 
        dt.location, 
        dt.status, 
        dt.image AS table_image, 
        r.city, 
        r.phone_number, 
        r.email, 
        r.opening_hours, 
        r.district, 
        r.img AS restaurant_image
      FROM dining_tables dt
      JOIN restaurant r ON dt.restaurant_id = r.restaurant_id
      WHERE dt.restaurant_id = ?
    `;
  
    Db.query(query, [restaurant_id], (err, results) => {
      if (err) {
        console.error('Error fetching tables:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Convert images to Base64 if necessary
      const resultsWithBase64Images = results.map((item) => ({
        ...item,
        table_image: toBase64(item.table_image),
        restaurant_image: toBase64(item.restaurant_image)
      }));
  
      res.json(resultsWithBase64Images);
    });
  });

  router.get('/tablePayment/:table_id', (req, res) => {
    const { table_id} = req.params;
  
    // SQL query to select dining tables by restaurant_id
    const query = `
      SELECT 
        dt.table_id, 
        dt.restaurant_id, 
        dt.table_number, 
        dt.seats,
        dt.price, 
        dt.location, 
        dt.status, 
        dt.image AS table_image, 
        r.city, 
        r.phone_number, 
        r.email, 
        r.opening_hours, 
        r.district, 
        r.img AS restaurant_image
      FROM dining_tables dt
      JOIN restaurant r ON dt.restaurant_id = r.restaurant_id
      WHERE dt.table_id = ?
    `;
  
    Db.query(query, [table_id], (err, results) => {
      if (err) {
        console.error('Error fetching tables:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Convert images to Base64 if necessary
      const resultsWithBase64Images = results.map((item) => ({
        ...item,
        table_image: toBase64(item.table_image),
        restaurant_image: toBase64(item.restaurant_image)
      }));
  
      res.json(resultsWithBase64Images);
    });
  });
module.exports = router;
