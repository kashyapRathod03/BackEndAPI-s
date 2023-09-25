const { connection } = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); 
const secretKey = process.env.SECRET_KEY;


exports.sellingform = async (req, res) => {
    const { waste_name, address, price, jwtToken } = req.body;
    let isPay;
    if (!jwtToken) {
        return res.send(false);
    }
    else {
        let e,role;
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
            role = decoded.role;
            // console.log(e);
        } catch (error) {
            console.log(error);
            res.send(false);
        }
        
        // const queryPayment = `SELECT * FROM sellers WHERE email=?`;
        // connection.query(query, [e], (err, result) => {
        //     if (err) {
        //         console.log('Error inserting data:', err);
        //         res.send('server');
        //     } else {
        //         // console.log('sell infromation:  ',result);
        //         isPay = result[0].payment
        //     }
        // });

        let imageurl;
        // if(role==='seller' && isPay){

        const query = 'SELECT * FROM seller_info WHERE email = ? AND waste_name = ?';
        connection.query(query, [e, waste_name],async (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                const productId = uuidv4();
                // console.log("result: ",result);
                description = await result[0].description;
                city = await result[0].city;
                quantity = await result[0].quantity;
                imageurl = await result[0].imageUrl;
                // console.log(imageurl);
                const insertQuery = 'INSERT INTO seller_sell (product_id, email, waste_name, description, city, address, imageUrl, quantity, price, stack) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                connection.query(insertQuery, [productId , e, waste_name, description, city, address, imageurl, quantity, price, quantity], (err, result) => {
                    if (err) {
                        console.log('Error inserting data:', err);
                    } else {
                        console.log('Data on sell successfully!');
                        return res.send(true);
                    }
                });
            }
        });

    // }else if(role==='buyer'){
    //     res.send('buyer');
    // }
    // else{
    //     res.send('pending');
    // }
}
};

// selling data according to seller

exports.selldata = async (req, res) => {
    const jwtToken = req.header('Authorization').replace('Bearer ', '');

    if (!jwtToken) {
        res.send(false);
    } else {
        let e;
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
        } catch (error) {
            console.log(error);
            res.send(false);
        }
        const query = 'SELECT * FROM seller_sell WHERE email = ?';

        connection.query(query, [e], (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
                res.send('server');
            } else {
                // console.log('sell infromation:  ',result);
                res.json(result);
            }
        });

    }
};


exports.sellproduct = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    // const role = req.header('Custom-Header');
    // console.log(token);
    const {product_id} =req.params;
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
        const query = 'SELECT * FROM seller_sell WHERE product_id = ?';
        connection.query(query, [product_id], (err, result) => {
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



exports.updatesellingform = async (req, res) => {
    const { productId, cropname, desc, city, address, price, amount, selectedValue, jwtToken } = req.body;
    console.log('product: ',productId);
    if (!jwtToken) {
        return res.send(false);
    }
    else {
        let e;
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
            // console.log(e);
        } catch (error) {
            res.send(false);
            console.log(error);
        }

        
        const updateQuery = 'UPDATE seller_sell SET crop=?,description=?,city=?,address=?,quality=?,amount=?,price=? WHERE product_id=?';
        connection.query(updateQuery, [ cropname,desc,city,address,selectedValue,amount,price,productId], (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
            } else {
                console.log('Data updated successfully!');
                res.send(true);
            }
        });

    }
};


exports.deleteselldata = async (req, res) => {
    const {product_id} =req.params;
   
        const query = 'DELETE FROM seller_sell WHERE product_id = ?';
        console.log('procuct deleted: ',product_id)
        connection.query(query, [product_id], (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                res.send(true);
            }
        });

    // }
};
