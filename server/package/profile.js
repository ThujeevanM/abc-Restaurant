const express = require('express');
const router = express.Router();
const Db = require('../connection/Dbconnect');
const bcrypt = require('bcrypt');

router.put("/update-user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { currentPassword, newPassword, firstName, lastName, street, city, gender, img } = req.body;

  try {
    // Fetch user details by user_id
    const userQuery = "SELECT password FROM user WHERE user_id = ?";
    Db.query(userQuery, [user_id], async (err, userResults) => {
      if (err) throw err;

      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const storedPassword = userResults[0].password;

      // If updating the password
      if (newPassword) {
        // Compare current password with the stored hash
        const isMatch = await bcrypt.compare(currentPassword, storedPassword);

        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the user table
        const updateUserQuery = "UPDATE user SET password = ? WHERE user_id = ?";
        Db.query(updateUserQuery, [newHashedPassword, user_id], (err) => {
          if (err) throw err;

          // Update customer details
          const updateCustomerDetails = () => {
            const updateCustomerQuery = `
              UPDATE customer SET first_name = ?, last_name = ?, street = ?, city = ?, gender = ?, img = ?
              WHERE user_id = ?
            `;

            // Decode the base64 image if provided
            const decodedImg = img
              ? img.replace(/^data:image\/\w+;base64,/, "") // Remove 'data:image/jpeg;base64,' or similar
              : null;

            // Convert the image back to a buffer for storing as LONGBLOB
            const imageBuffer = decodedImg ? Buffer.from(decodedImg, "base64") : null;

            // Update customer details with decoded image data
            Db.query(
              updateCustomerQuery,
              [firstName, lastName, street, city, gender, imageBuffer, user_id],
              (err) => {
                if (err) throw err;
                res.status(200).json({ message: "User and customer details updated successfully" });
              }
            );
          };

          updateCustomerDetails();
        });
      } else {
        // If no new password is provided, just update customer details
        const updateCustomerQuery = `
          UPDATE customer SET first_name = ?, last_name = ?, street = ?, city = ?, gender = ?, img = ?
          WHERE user_id = ?
        `;
 
        const decodedImg = img
          ? img.replace(/^data:image\/\w+;base64,/, "") // Remove the base64 header
          : null;

        const imageBuffer = decodedImg ? Buffer.from(decodedImg, "base64") : null;

        Db.query(updateCustomerQuery, [firstName, lastName, street, city, gender, imageBuffer, user_id], (err) => {
          if (err) throw err;

          res.status(200).json({ message: "Customer details updated successfully" });
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});
 
  

  module.exports = router;
