const { connection } = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.profile = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        res.send(false);
    } else {
        let e;
        try {
            const decoded = jwt.verify(token, secretKey);
            e = decoded.email;
            role = decoded.role;
        } catch (error) {
            console.log(error);
            res.send(false);
        }
        if (role === 'farmer') {

            const query = 'SELECT * FROM sellers WHERE email = ?';

            connection.query(query, [e], (err, result) => {
                if (err) {
                    console.log('Error to fethching data:', err);
                    res.send('server');
                } else {
                    console.log(result);
                    res.send(result);
                    // const { name, email, mobile } = result[0];
                    // return res.status(200).json({ name, email, mobile });
                }
            });
        }
        else {
            const query = 'SELECT * FROM buyers WHERE email = ?';

            connection.query(query, [e], (err, result) => {
                if (err) {
                    console.log('Error to fethching data:', err);
                    res.send('server');
                } else {
                    console.log(result);
                    res.send(result);
                    // const { name, email, mobile } = result[0];
                    // return res.status(200).json({ name, email, mobile });
                }
            });
        }

    }
};