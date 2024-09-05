const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect"); // Replace with your actual database connection

// GET API to retrieve all menu categories
router.get("/category", (req, res) => {
  const query = "SELECT * FROM menu_category";

  Db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Encode image data as Base64 if needed
    const resultsWithBase64Images = results.map((category) => ({
      ...category,
      img: category.img
        ? `data:image/jpeg;base64,${Buffer.from(category.img).toString(
            "base64"
          )}`
        : null,
    }));

    res.json(resultsWithBase64Images);
  });
});

module.exports = router;
