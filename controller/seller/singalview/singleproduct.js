const {connection} = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.singleproduct = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
   
    const {waste_name} =req.params;
    // console.log(waste_name);
    if (!token) {
        res.send(false);
    } else {
        let e;
        try {
            const decoded = jwt.verify(token, secretKey);
            e = decoded.email;
        } catch (error) {
            console.log(error);
            res.send(false);
        }
        const query = 'SELECT * FROM seller_info WHERE email = ? AND waste_name = ?';
        connection.query(query, [e,waste_name], (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                // console.log(result);
                return res.json(result);
            }
        });

    }
};