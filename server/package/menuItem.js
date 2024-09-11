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

router.get('/menu-items/get-all-menu-items', (req, res) => {
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
      mi.food_id;
  `;

  Db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      return res.status(500).json({ error: 'Error fetching menu items' });
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


router.put('/menu-items/update/:food_id', (req, res) => {
  const { name, description, img, price, available, categoryId } = req.body;
  const { food_id } = req.params;

  // Remove the 'data:image/jpeg;base64,' prefix from the base64 image string
  const decodedImg = img
    ? img.replace(/^data:image\/\w+;base64,/, "") // Remove 'data:image/jpeg;base64,' or similar
    : null;

  // Convert the image back to a buffer for storing as LONGBLOB
  const imageBuffer = decodedImg ? Buffer.from(decodedImg, "base64") : null;

  const query = `
    UPDATE menu_items
    SET 
      name = ?,
      description = ?,
      img = ?,
      price = ?,
      available = ?,
      category_id = ?
    WHERE 
      food_id = ?;
  `;

  const values = [name, description, imageBuffer, price, available, categoryId, food_id];

  Db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating menu item:', err);
      return res.status(500).json({ error: 'Error updating menu item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated successfully' });
  });

});

router.post('/menu-items/add', (req, res) => {
  const { name, description, img, price, available, categoryId } = req.body;

  // Remove the 'data:image/jpeg;base64,' prefix from the base64 image string
  const decodedImg = img
    ? img.replace(/^data:image\/\w+;base64,/, "") // Remove 'data:image/jpeg;base64,' or similar
    : null;

  // Convert the image back to a buffer for storing as LONGBLOB
  const imageBuffer = decodedImg ? Buffer.from(decodedImg, "base64") : null;

  const query = `
    INSERT INTO menu_items 
    (name, description, img, price, available, category_id) 
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  const values = [name, description, imageBuffer, price, available, categoryId];

  Db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding menu item:', err);
      return res.status(500).json({ error: 'Error adding menu item' });
    }
    res.json({ message: 'Menu item added successfully', insertId: result.insertId });
  });
});


router.delete('/menu-items/delete/:food_id', (req, res) => {
  const { food_id } = req.params;

  const query = `
    DELETE FROM menu_items 
    WHERE food_id = ?;
  `;

  Db.query(query, [food_id], (err, result) => {
    if (err) {
      console.error('Error deleting menu item:', err);
      return res.status(500).json({ error: 'Error deleting menu item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  });
});



module.exports = router;
