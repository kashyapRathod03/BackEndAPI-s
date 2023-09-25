const nodemailer = require("nodemailer");
const { authenticator } = require('otplib');
var mysql_package = require('mysql');

const secret = authenticator.generateSecret();
const otp = authenticator.generate(secret);

var connection = mysql_package.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wastemanagement"
});
const query = 'SELECT * FROM buyers WHERE email = ?';

const sendemail = (req, res, next) => {

    const { email } = req.body;

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.log('Error querying data:', err);
            res.send(false);
        } else if (results.length == 0) {
            console.log('no account...');
            res.send(false);
        } else {

            try {

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: 'kashyaprathod03@gmail.com',
                        pass: 'ydintcequcjecphk'
                    }
                });

                const mailOptions = {
                    from: 'kashyaprathod03@gmail.com',
                    to: email,
                    subject: "wastemanagement Reset password",
                    html: `Genrated OTP for your reset password: <br/> ${otp}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error" + error)
                    } else {
                        // console.log("Email sent:" + info.response);
                        // res.send();
                        res.send(email);
                    }
                });
                next();
            } catch (error) {
                console.log("Error" + error);
                res.send(false);
                next();
            }
        }
    });
};

const checkotp = (req, res, next) => {
    const userOtp = req.body.otp;
    console.log(req.body.otp);
    // const isValid = authenticator.check(userOtp, secret);

    if (userOtp === otp) {
        res.send(true);
        next();
    }
    else {
        res.send(false);
        next();
    }
}

const setpassword = (req,res,next)=>{
    const {password,confirmPassword,email} = req.body;
    const query = "UPDATE buyers SET password = ? WHERE email = ?";
    console.log(email);
            connection.query(query, [password, email], (err, result) => {
                if (err) {
                    console.log('Error inserting data:', err);
                    res.send(true);
                    next();
                } else {
                    console.log('Data inserted successfully!');
                    res.send(true);
                    next();
                }
            });
        }


module.exports = { sendemail, checkotp, setpassword };