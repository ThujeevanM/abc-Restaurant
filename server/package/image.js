const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");



router.get('/', (req, res) => {
    const query = 'SELECT img_id, img, Description FROM img ORDER BY img_id DESC LIMIT 6';
  
    Db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const resultsWithBase64Images = results.map((img) => ({
        ...img, 
        img: img.img
          ? `data:image/jpeg;base64,${Buffer.from(img.img).toString(
              "base64"
            )}`
          : null,
      }));
  
      res.json(resultsWithBase64Images);
    });
  });

  module.exports = router;
