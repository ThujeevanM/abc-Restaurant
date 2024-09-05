const express = require('express');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const router =express.Router()
router.use(cookieParser());
 const Db =require ('../connection/Dbconnect')

 router.post('/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if required fields are present
    if (!firstName || !lastName) {
        return res.status(400).json({ msg: 'First name and last name are required' });
    }

    // Start the transaction
    Db.beginTransaction((err) => {
        if (err) return res.status(500).json({ msg: 'Server error1' });

        // Check if the user already exists
        Db.query('SELECT email FROM user WHERE email = ?', [email], (err, result) => {
            if (err) return Db.rollback(() => res.status(500).json({ msg: 'Server error2' }));
            if (result.length > 0) return res.status(400).json({ msg: 'User already exists' });

            // Hash the password and insert the user into the database
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return Db.rollback(() => res.status(500).json({ msg: 'Server error3' }));

                const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
                Db.query(sql, [email, hash], (err, result) => {
                    if (err) return Db.rollback(() => res.status(500).json({ msg: 'Server error4' }));

                    const userId = result.insertId;
                    const customerSql = 'INSERT INTO customer (`user_id`, `first_name`, `last_name`) VALUES (?, ?, ?)';
                    const customerValues = [userId, firstName, lastName];

                    // Insert customer details
                    Db.query(customerSql, customerValues, (err) => {
                        if (err) {
                            // Rollback the transaction if customer insertion fails
                            return Db.rollback(() => {
                                Db.query('DELETE FROM user WHERE id = ?', [userId], (delErr) => {
                                    if (delErr) return res.status(500).json({ msg: 'Server error during rollback' });
                                    res.status(500).json({ msg: 'Registration failed' });
                                });
                            });
                        }

                        // Commit the transaction
                        Db.commit((err) => {
                            if (err) return Db.rollback(() => res.status(500).json({ msg: 'Server error7' }));
                            res.status(201).json({ msg: 'User registered successfully' });
                        });
                    });
                });
            });
        });
    });
});




router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the user exists
    Db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).json({ msg: 'Server error', error: err.message });
        }

        if (result.length === 0) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const user = result[0];

        // Compare the provided password with the stored hash
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err); // Log the error for debugging
                return res.status(500).json({ msg: 'Server error', error: err.message });
            }

            if (!isMatch) {
                return res.status(400).json({ msg: 'Incorrect password' });
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.user_id, role: user.user_role }, 'your_jwt_secret', { expiresIn: '1h' });

            // Respond with the token only
            res.json({
                status: 'success',
                token: token
            });
        });
    });
});

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

router.get('/user-details', authenticateToken, (req, res) => {
    const { id, role } = req.user;

    let additionalDataQuery;
    let additionalDataValues;

    switch (role) {
        case 'customer':
            additionalDataQuery = 'SELECT * FROM customer WHERE user_id = ?';
            additionalDataValues = [id];
            break;
        case 'staff':
            additionalDataQuery = 'SELECT * FROM staff WHERE user_id = ?';
            additionalDataValues = [id];
            break;
        case 'admin':
            additionalDataQuery = 'SELECT * FROM admin WHERE user_id = ?'; // Replace with actual query for admin
            additionalDataValues = [id];
            break;
        default:
            return res.status(400).json({ msg: 'Invalid role' });
    }

    Db.query(additionalDataQuery, additionalDataValues, (err, additionalData) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).json({ msg: 'Server error', error: err.message });
        }

        if (additionalData.length > 0 && additionalData[0].img) {
            additionalData[0].img = `data:image/jpeg;base64,${additionalData[0].img.toString('base64')}`;
        }
        res.json({
            status: 'success',
            user: {
                id: id,
                role: role,
                details: additionalData[0] // Assuming single row returned
            }
        });
    });
});








module.exports= router;