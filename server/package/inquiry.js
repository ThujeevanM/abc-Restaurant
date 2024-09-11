const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");



// POST endpoint to create a new inquiry
router.post("/", (req, res) => {
  const { id, user_name, phone_no, type, details } = req.body;

  // SQL query to insert a new inquiry
  const query = `
    INSERT INTO Inquiry (
      customer_name, 
      customer_id, 
      phone_number, 
      inquiry_type, 
      inquiry_details
    ) VALUES (?, ?, ?, ?, ?)
  `;

  Db.query(
    query,
    [
      user_name,
      id,
      phone_no,
      type,
      details,
    ],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res
        .status(201)
        .json({
          message: "Inquiry created successfully",
          inquiryId: results.insertId,
        });
    }
  );
});


router.get('/get/:id', (req, res) => {
    const customerId = req.params.id;
    const query = `
    SELECT 
      i.inquiry_id, 
      i.customer_name, 
      i.customer_id, 
      c.img AS customer_image, 
      i.phone_number, 
      i.inquiry_type, 
      i.inquiry_details, 
      i.inquiry_date, 
      i.status, 
      i.response, 
      i.resolved_date, 
      i.staff_id, 
      s.staff_name 
    FROM 
      inquiry i 
    JOIN 
      customer c 
    ON 
      i.customer_id = c.user_id 
    LEFT JOIN 
      staff s 
    ON 
      i.staff_id = s.staff_id 
    WHERE 
      i.customer_id = ?;
  `;

  // Execute the query with customer_id as a parameter
  Db.query(query, [customerId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      // Convert customer image to base64
      const resultsWithBase64Images = results.map((result) => ({
        ...result,
        customer_image: result.customer_image
          ? `data:image/jpeg;base64,${Buffer.from(result.customer_image).toString('base64')}`
          : null, // Handle the case when the image is null
      }));
  
      // Send the modified results as the response 
      res.json(resultsWithBase64Images);
    });
  });

  router.get('/staffGet', (req, res) => {
   
    const query = `
    SELECT 
  i.inquiry_id, 
  i.customer_name, 
  i.customer_id, 
  c.img AS customer_image, 
  i.phone_number, 
  i.inquiry_type, 
  i.inquiry_details, 
  i.inquiry_date, 
  i.status, 
  i.response, 
  i.resolved_date 
FROM 
  inquiry i 
JOIN 
  customer c 
ON 
  i.customer_id = c.user_id 
WHERE 
  i.status IN ('Pending', 'In Progress')
  `;

  // Execute the query with customer_id as a parameter
  Db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      // Convert customer image to base64
      const resultsWithBase64Images = results.map((result) => ({
        ...result,
        customer_image: result.customer_image
          ? `data:image/jpeg;base64,${Buffer.from(result.customer_image).toString('base64')}`
          : null, // Handle the case when the image is null
      }));
  
      // Send the modified results as the response
      res.json(resultsWithBase64Images);
    });
  });


  router.get('/inquiry/:inquiry_id', (req, res) => {
    const inquiryId = req.params.inquiry_id;
  
    try {
      const query = `
        SELECT 
          i.inquiry_id, 
          i.customer_name, 
          i.customer_id, 
          i.phone_number, 
          i.inquiry_type, 
          i.inquiry_details, 
          i.inquiry_date, 
          i.status, 
          i.response, 
          i.resolved_date, 
          i.staff_id 
        FROM inquiry i
        WHERE i.inquiry_id = ?
      `;
  
      // Execute the query
      Db.query(query, [inquiryId], (error, results) => {
        if (error) {
          console.error('Error fetching inquiry:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'Inquiry not found' });
        }
  
        // Return the results as JSON
        res.json(results[0]); // Since you are fetching by inquiry_id, return the first object
      });
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  router.put('/replay/:inquiry_id', (req, res) => {
    const inquiryId = req.params.inquiry_id;
    const { status, answer, staffId } = req.body;
    const resolved_date = new Date(); // Current date
  
    try {
      const query = `
        UPDATE inquiry 
        SET 
          status = ?, 
          response = ?, 
          resolved_date = ?, 
          staff_id = ?
        WHERE inquiry_id = ?
      `;
  
      // Execute the update query
      Db.query(query, [status, answer, resolved_date, staffId, inquiryId], (error, results) => {
        if (error) {
          console.error('Error updating inquiry:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Inquiry not found or no changes made' });
        }
  
        res.json({ message: 'Inquiry updated successfully' });
      });
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ message: 'Internal Server Error' });  
    }
  });
  

module.exports = router;
