const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");

router.get("/menu-items", (req, res) => {
  const query = `
      SELECT 
        mi.food_id,
        mi.name AS item_name,
        mi.description AS item_description,
        mi.img AS item_img,
        mi.price,
        mi.available,
        mi.category_id,
        mc.name AS category_name
      
      FROM 
        menu_items mi
      JOIN 
        menu_category mc ON mi.category_id = mc.category_id
      ORDER BY 
        mi.food_id DESC
      LIMIT 10;
    `;

  Db.query(query, (error, results) => {
    if (error) {
      console.error("Query error: ", error);
      res.status(500).send("Server error");
      return;
    }
    const resultsWithBase64Images = results.map((items) => ({
      ...items,
      item_img: items.item_img
        ? `data:image/jpeg;base64,${Buffer.from(items.item_img).toString(
            "base64"
          )}`
        : null,
    }));

    res.json(resultsWithBase64Images);
  });
});

router.get("/items/:category_id", (req, res) => {
  const categoryId = req.params.category_id;

  // SQL query to get items by category_id
  const sql = `
    SELECT mi.food_id, mi.name AS item_name, mi.description AS item_description, mi.img AS item_img, mi.price, mi.available, mc.name AS category_name, mc.Description AS category_description, mc.category_id as category_id FROM menu_items mi JOIN menu_category mc ON mi.category_id = mc.category_id WHERE mi.category_id = ?;
  `;

  // Execute the query
  Db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching items." });
      return;
    }
    const resultsWithBase64Images = results.map((items) => ({
      ...items,
      item_img: items.item_img
        ? `data:image/jpeg;base64,${Buffer.from(items.item_img).toString(
            "base64"
          )}`
        : null,
    }));

    res.json(resultsWithBase64Images);
  });
});

router.post("/search", (req, res) => {
  const { category, foodName } = req.body;

  // Normalize the input by trimming, removing extra spaces, and converting to lowercase
  const normalizedFoodName = `%${foodName.trim().toLowerCase()}%`;
  const normalizedCategory = `%${category.trim().toLowerCase()}%`;

  const sql = `
    SELECT 
        mi.food_id,
        mi.name AS item_name,
        mi.description AS item_description,
        mi.img AS item_img,
        mi.price,
        mi.available,
        mc.name AS category_name
    FROM 
        menu_items mi
    JOIN 
        menu_category mc ON mi.category_id = mc.category_id
    WHERE 
 LOWER(TRIM(mi.name)) LIKE ? 
 AND LOWER(TRIM(mc.name)) LIKE ?;
  `;

  Db.query(sql, [normalizedFoodName, normalizedCategory], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "An error occurred while searching." });
      return;
    }

    // Convert image data to base64 format if available
    const resultsWithBase64Images = results.map((item) => ({
      ...item,
      item_img: item.item_img
        ? `data:image/jpeg;base64,${Buffer.from(item.item_img).toString(
            "base64"
          )}`
        : null,
    }));

    res.json(resultsWithBase64Images);
  });
});
router.get('/item/:foodId', (req, res) => {
  const { foodId } = req.params;

  const sql = `
    SELECT 
        mi.food_id,
        mi.name AS item_name,
        mi.description AS item_description,
        mi.img AS item_img,
        mi.price,
        mi.available,
        mc.name AS category_name
    FROM 
        menu_items mi
    JOIN 
        menu_category mc ON mi.category_id = mc.category_id
    WHERE 
        mi.food_id = ?;
  `;

  Db.query(sql, [foodId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'An error occurred while retrieving the item.' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }

    // Convert image data to base64 format
    const itemWithBase64Image = {
      ...results[0],
      item_img: results[0].item_img
        ? `data:image/jpeg;base64,${Buffer.from(results[0].item_img).toString("base64")}`
        : null,
    };

    res.json(itemWithBase64Image);
  });
});
module.exports = router;
