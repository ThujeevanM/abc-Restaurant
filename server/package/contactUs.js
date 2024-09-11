const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");


router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
  
    Db.query(query, [name, email, message], (err, result) => {
      if (err) {
        console.error('Error inserting contact:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Contact information saved successfully' });
    });
  });

  module.exports = router;