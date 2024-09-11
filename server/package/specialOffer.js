const express = require("express");
const router = express.Router();
const Db = require("../connection/Dbconnect");
const moment = require('moment-timezone');

router.get('/special-offers', async (req, res) => {
  try {
      // Get current Sri Lanka time
      const sriLankaTime = moment.tz('Asia/Colombo').format('YYYY-MM-DD ');

      // Query to get active special offers
      const query = `
         SELECT SpecialOffer.offer_id, 
                SpecialOffer.offer_title, 
                SpecialOffer.offer_description, 
                SpecialOffer.offer_start_date, 
                SpecialOffer.offer_end_date, 
                SpecialOffer.discount_percentage, 
                SpecialOffer.offer_img AS special_offer_img, 
                menu_items.name AS food_name, 
                menu_items.available AS food_available, 
                menu_items.price AS food_price 
         FROM SpecialOffer 
         JOIN menu_items ON SpecialOffer.food_id = menu_items.food_id 
         WHERE SpecialOffer.is_active = TRUE AND SpecialOffer.offer_end_date > ?
      `;

      // Execute the query with the current Sri Lanka time
      Db.query(query,[sriLankaTime], (err, result) => {
          if (err) {
              console.error("Database query error:", err);
              return res.status(500).json({ message: "Database error", error: err });
          }

          // Adjust the date to Sri Lanka time
          const formattedResult = result.map(offer => ({
              ...offer,
              offer_start_date: moment(offer.offer_start_date).tz('Asia/Colombo').format('YYYY-MM-DD'),
              offer_end_date: moment(offer.offer_end_date).tz('Asia/Colombo').format('YYYY-MM-DD'),
              special_offer_img: offer.special_offer_img
              ? `data:image/jpeg;base64,${Buffer.from(offer.special_offer_img).toString('base64')}`
              : null, // Handle case if the image is not available
          }));
    
          // Return the formatted result to the client
          res.status(200).json(formattedResult);
        });
  } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
  }
});







module.exports = router;