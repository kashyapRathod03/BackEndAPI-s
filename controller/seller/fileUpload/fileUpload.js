const cloudinary = require("cloudinary").v2;
const {connection} = require('../../../database/conn');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

//isse upload hoga
async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    console.log("temp file path",file.tempFilePath);
    if(quality){
        options.quality =quality;
    }
    options.resource_type = "auto";
    let res;
    try {
       res =  cloudinary.uploader.upload(file.tempFilePath,options);
       return res;
    } catch (error) {
        console.log('cannot upload image'+error);
    }

}
exports.uploadImage = async(req, res) => {
    const { waste_name, catagory, description, quantity, city, jwtToken } = req.body;
    const file = req.files && req.files.img;
    console.log(file);

    if (!jwtToken) {
        res.send(false);
    }
    else {
        let e;
        try {
            const decoded = jwt.verify(jwtToken, secretKey);
            e = decoded.email;
            // console.log(e);
        } catch (error) {
            console.log(error);
        }

        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type:",fileType)
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.send('formate_error');
        }
         //file format supported hai
         const response = await uploadFileToCloudinary(file,"wastemanagement",30);
        //  console.log(response);

         let imageUrl = response.secure_url;
        //  console.log(e);
        const insertQuery = 'INSERT INTO seller_info (email, waste_name, catagory, description, quantity, city, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(insertQuery, [e, waste_name, catagory, description, quantity, city, imageUrl], (err, result) => {
            if (err) {
                console.log('Error inserting data:', err);
            } else {
                console.log('Data inserted successfully!');
                res.send(true);
            }
        });
    }
};