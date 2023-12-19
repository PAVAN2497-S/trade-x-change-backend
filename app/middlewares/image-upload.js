// aws-upload.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid")
// Configure the AWS SDK with your credentials
const s3 = new AWS.S3({
   accessKeyId: process.env.ACCESS_KEY_ID,
   secretAccessKey: process.env.SECRET_ACCESS_KEY,
   region: process.env.REGION,
   signatureVersion: 'v4'
});

async function uploadToS3(file) {
   const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer
   }
   // console.log('here')
   const data = await s3.upload(params).promise();
   return { url: data.Location, key: data.Key };
}
//for deleting image i have to pass the key
async function deleteFromS3(key) {
   const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key
   }

   try {
      await s3.deleteObject(params).promise();
      console.log("image deleted");
      return true
   } catch (error) {
      return false
   }
}
module.exports = { uploadToS3, deleteFromS3 };