require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); 

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const port = 5000;
const secretKey = process.env.SECRET_KEY;

const { sendemail, checkotp, setpassword } = require('./middleware/buyer_send_email');
const { fsendemail, fcheckotp, fsetpassword } = require('./middleware/seller_send_email');
const {HomeProductSingle,singleproduct_home,productpage} = require('./controller/home_single_product');
const {uploadImage} = require('./controller/seller/fileUpload/fileUpload');
const {connection} = require('./database/conn');
const {profile} = require('./controller/seller/profile/profile');
const {singleproduct} = require('./controller/seller/singalview/singleproduct');
const {signin,signup} = require('./controller/buyer/Register/register');
const {updateData} = require('./controller/seller/fileUpdate/fileUpdate');
const {sellingform,selldata,sellproduct,updatesellingform,deleteselldata} = require('./controller/seller/sell/selling_from'); 
const {AddToCart,cartproduct,deleteCartData} = require('./controller/buyer/Cart/addtocart');
// const {orderAddress,orderHistory} = require('./controller/buyer/Order/order');
const {buynNowSession} = require('./config/payment');

const fileupload = require("express-fileupload"); // server pe file upload
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/temp/'
}));

const cloudinary2 = require("./config/cloudinary");
cloudinary2.cloudinaryConnect();
// .......................................................for Chart Information......................................................

// homepage seller product information
app.get(`/`, async (req, res) => {
    const query = `SELECT waste_name, catagory, description, quantity, city, imageUrl FROM seller_info`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log('Error inserting data:', err);
        } else {
            console.log(result);
            res.json(result);
        }
    });

});


// homepage single productview
app.get('/productview/:waste_name',singleproduct_home);

// product page
app.get('/product/detailes',productpage);
app.get('/product/detailes/:product_id',HomeProductSingle);
app.post('/product/detailes/addtocart/',AddToCart);

// profile page url
app.get(`/profile`,profile);

// .......................................................for sellers signup ......................................................

app.post("/sellers/signup", async (req, res) => {
    const { name, email, mobile, password, address } = req.body;

    const checkQuery = 'SELECT * FROM sellers WHERE mobile = ? OR email = ?';
    const insertQuery = 'INSERT INTO sellers (user_id, name, email, mobile, password, address) VALUES (?, ?, ?, ?, ?, ?)';
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
});

app.post('/sellers/signin', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM sellers WHERE email = ? AND password = ?';
    const payload = {
        email: email,
        password: password,
        role: 'seller'
    };
    const options = {
        expiresIn: '24hr'
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
            res.json({ token });
        }
    });
});

// get all products of seller
app.get(`/seller/getinfo/`, async (req, res) => {
    const jwtToken = req.header('Authorization').replace('Bearer ', '');

    if (!jwtToken) {
        res.send('not found');
    } else {
        let e;
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
        } catch (error) {
            console.log(error);
            res.send('error');
        }
        const query = 'SELECT * FROM seller_info WHERE email = ?';

        connection.query(query, [e], (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
                res.send('server');
            } else {
                res.json(result);
            }
        });

    }
});

app.post('/seller/send_mail', fsendemail, (req, res) => {
    // console.log('Mail Sent...');
});
app.post('/seller/otp', fcheckotp, (req, res) => {
    // console.log('OTP check function');
});
app.post('/seller/resetPassword', fsetpassword, (req, res) => {
    // console.log('password added');
});


app.post('/sellers/product_insert_information',uploadImage);

app.get('/seller/singleproduct/:waste_name',singleproduct);

app.post('/sellers/update_product', updateData);
  
app.post('/sellers/sell_form', sellingform);

app.get(`/seller/sellinfo`,selldata);

app.get('/seller/sellproduct/:product_id',sellproduct);

app.post('/sellers/update_sell_form',updatesellingform);

app.delete('/seller/deleteproduct/:product_id',deleteselldata);

// .......................................................for buyers signup ......................................................

app.post("/buyer/signup", signup);

app.post('/buyer/signin',signin);

app.post('/buyer/send_mail', sendemail, (req, res) => {
    // console.log('Mail Sent...');
});
app.post('/buyer/otp', checkotp, (req, res) => {
    // console.log('OTP check function');
});
app.post('/buyer/resetPassword', setpassword, (req, res) => {
    // console.log('password added');
});

// app.post('/buyer/',signin);

app.get('/buyer/cartdetails/',cartproduct);

app.delete('/buyer/deletecartproduct/',deleteCartData);






app.listen(port, () => {
    console.log("server start:5000");
});







// app.post('/buyer/buynow-session',buynNowSession);
// app.post('/buyer/orderaddress',orderAddress);
// app.get('/buyer/orderhistory',orderHistory);