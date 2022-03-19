import { config } from "dotenv";

import fs from 'fs'
import S3 from 'aws-sdk/clients/s3.js';
config();
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
 export function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)
  let extArray = file.mimetype.split("/");
 // console.log(extArray)
  let extension = extArray[extArray.length - 1];
 // console.log(extension)
  let file_with_ext = file.filename + "." + extension
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file_with_ext
  }
  return s3.upload(uploadParams).promise()
}
//exports.uploadFile = uploadFile


// downloads a file from s3
export function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
//exports.getFileStream = getFileStream

//export function {uploadFile, getFileStream}