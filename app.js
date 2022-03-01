import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import { config } from "dotenv";
import bodyParser from 'body-parser';

import fs from 'fs';
import util from 'util';
import { uploadFile, getFileStream} from './server/s3upload/s3.js';
import multer from 'multer';
//const { uploadFile, getFileStream } = require('./server/s3upload/s3')

const unlinkFile = util.promisify(fs.unlink)

const upload = multer({ dest: 'uploads/' })
config();

const port = Number(process.env.PORT);
const uri = String(process.env.MONGO_URI);
const connectOptions =  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose
  .connect(uri, connectOptions)
  .then()
  .catch((err) => console.log("Error:" + err));

mongoose.connection.once("open", () =>
  console.log("Connected to MongoDB successfully...")
);

const app = express();


app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
import employee from "./server/employee/employee.route.js"
app.use('/api/users/', employee)

// Import user route and create user route middelware
import user from "./server/users/user.route.js"
app.use('/api/users/', user)

// employee route

// Handle errors.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});
  
app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

/*
app.get("*", (req, res) => {
    messager(res, 404, "route not found");
  });
  */
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
  