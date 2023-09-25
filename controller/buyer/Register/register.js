const {connection} = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const { v4: uuidv4 } = require('uuid'); 


exports.signin = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM buyers WHERE email = ? AND password = ?';
    const payload = {
        email: email,
        password: password,
        role: 'buyer'
    };
    const options = {
        expiresIn: '24h'
    };
    const token = jwt.sign(payload, secretKey, options);

    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying data:', err);
            res.send(false);
        } else if (results.length === 0) {
            console.log('login unsuccessfull...');
            res.send(false);
        } else {
            console.log('login success');
            res.json({ token, email });
        }
    });
};



exports.signup = async (req, res) => {
    const { name, email, mobile, password, address } = req.body;

    const checkQuery = 'SELECT * FROM buyers WHERE mobile = ? OR email = ?';
    const insertQuery = 'INSERT INTO buyers (user_id, name, email, mobile, password, address) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(checkQuery, [mobile, email], (err, results) => {
        if (err) {
            console.error('Error querying data:', err);
            res.send('Error signing up.');
        } else if (results.length > 0) {
            res.send(false);
        } else {
            const userId = uuidv4();

            connection.query(insertQuery, [userId, name, email, mobile, password, address], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                } else {
                    console.log('Data inserted successfully!');
                    res.send(true);
                }
            });
        }
    });
};