var mysql_package = require('mysql');

exports.connection = mysql_package.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wastemanagement"
});
// exports.connection = mysql_package.createConnection({
//   host: "localhost",
//   user: "kashyap",
//   password: "kashyap",
//   database: "wastemanagement"
// });

//   connection_data.connect(function(err) {
//    console.log("Connected to XAMPP Server!");
//    connection_data.query("CREATE DATABASE wastemanagement", function (err, result) {
//      console.log("Database-facility is created");
//    });
//   });

// var sql = "CREATE TABLE seller_info (id INT(255), email VARCHAR(50),crop VARCHAR(255),city VARCHAR(50),area VARCHAR(50), acre INT(255), bigha INT(255))";
// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });



// const insertQuery = 'INSERT INTO sellers (name, email, mobile, password,cpassword) VALUES (?, ?, ?, ?, ?)';
// const newRecord = {
//   name: 'John Doe',
//   email: 'john@example.com',
//   mobile: '1234567890',
//   password: 'kashyap30',
//   cpassword: 'kashyap30'
// };

// // SQL query to insert data

// connection_data.query(insertQuery, [newRecord.name, newRecord.email, newRecord.mobile, newRecord.password, newRecord.cpassword], (err, result) => {
//   if (err) {
//     console.error('Error inserting data:', err);
//   } else {
//     console.log('Data inserted successfully!');
//   }
//   connection_data.end();
// });
