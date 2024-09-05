const express = require('express');
const router =express.Router()
 const Db =require ('../connection/Dbconnect')

 router.post('/search', (req, res) => {
    const { city, district } = req.body;

   const query = 'SELECT * FROM restaurant WHERE city = ? AND district LIKE ?';
    

    Db.query(query,[city,district] , (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Encode image data as Base64 if needed
        const resultsWithBase64Images = results.map(restaurant => ({
            ...restaurant,
            img: restaurant.img ? `data:image/jpeg;base64,${Buffer.from(restaurant.img).toString('base64')}` : null // Adjust content type if needed
        }));

        res.json(resultsWithBase64Images);
    });
});

router.get('/restaurants', (req, res) => {
    const query = 'SELECT * FROM restaurant';
  
    Db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Encode image data as Base64 if needed
      const resultsWithBase64Images = results.map(restaurant => ({
        ...restaurant,
        img: restaurant.img ? `data:image/jpeg;base64,${Buffer.from(restaurant.img).toString('base64')}` : null // Adjust content type if needed
      }));
  
      res.json(resultsWithBase64Images);
    });
  });
 
module.exports= router;