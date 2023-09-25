const { connection } = require('../database/conn');



exports.HomeProductSingle = async (req, res) => {
    const { product_id } = req.params;
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

};



exports.productpage = async (req, res) => {
    // const crop = 'shing'
    const query = `SELECT * FROM seller_sell WHERE stack > 0;`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log('Error inserting data:', err);
        } else {
            // console.log(result);
            res.json(result);
        }
    });

};

// home page simpple non selling data information
exports.singleproduct_home = async (req, res) => {
    const { waste_name } = req.params;
    console.log(waste_name + 'single');
    try {
        const query = 'SELECT * FROM seller_info WHERE waste_name = ?';
        connection.query(query, [waste_name], (err, result) => {
            if (err) {
                console.log('Error to fethching data:', err);
                res.send('server');
            } else {
                // console.log(result);
                return res.json(result);
            }
        });
    } catch (error) {
        console.log('error of single product view', error);
    }

};

