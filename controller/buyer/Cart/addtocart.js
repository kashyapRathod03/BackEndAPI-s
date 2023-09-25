const {connection} = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.AddToCart = async (req, res) => {
    const {jwtToken,product_id} = req.body;
    if(!jwtToken){
        res.send(false);
    }
    else{
        let e; 
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
        } catch (error) {
            console.log(error);
            res.send(false);
        }
        const insertQuery = 'INSERT INTO buyer_cart (product, user)  VALUES (?, ?)';

        connection.query(insertQuery, [product_id,e], (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                console.log(result);
                res.send(true);
            }
        });
    }
};

// buyers cart items .........................

exports.cartproduct = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        res.send(false);
        return; // Exit the function early
    }

    let e;
    try {
        const decoded = jwt.verify(token, secretKey);
        e = decoded.email;
    } catch (error) {
        console.log(error);
        res.send(false);
        return; // Exit the function early
    }

    const query = 'SELECT * FROM buyer_cart WHERE user = ?';
    connection.query(query, [e], (err, result) => {
        if (err) {
            console.log('Error fetching data:', err);
            res.send('server');
        } else {
            const productIds = result.map(row => row.product);
            
            // Query the seller_sell table to get product details based on productIds
            const getProductDetailsQuery = 'SELECT * FROM seller_sell WHERE product_id IN (?)';
            connection.query(getProductDetailsQuery, [productIds], (err, productDetails) => {
                if (err) {
                    console.log('Error fetching product details:', err);
                    res.send('server');
                } else {
                    return res.json(productDetails);
                }
            });
        }
    });
};

exports.deleteCartData = async (req, res) => {
    const product_id =req.body.pId;
    console.log(product_id);
        const query = 'DELETE FROM buyer_cart WHERE product = ?';
        console.log('product deleted: ',product_id)
        connection.query(query, [product_id], (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                res.send(true);
            }
        });

};

// exports.cartproduct = async (req, res) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     // console.log(token);
//     if (!token) {
//         res.send(false);
//     } else {
//         let e;
//         try {
//             const decoded = jwt.verify(token, secretKey);
//             e = decoded.email;
//         } catch (error) {
//             console.log(error);
//             res.send(false);
//         }
//         const query = 'SELECT * FROM buyer_cart WHERE user = ?';
//         connection.query(query, [e], (err, result) => {
//             if (err) {
//                 console.log('Error to fethching data:', err);
//                 res.send('server');
//             } else {
//                 const products = result.map(row => row.product); 
//                 console.log(products);
//                 return res.json(result);
//             }
//         });

//     }
// };