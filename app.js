import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import { config } from "dotenv";
import bodyParser from 'body-parser';

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

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 /*
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
*/

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
import employee from "./server/employee/employee.route.js"
app.use('/api/users/', employee)

// Import user route and create user route middelware
import user from "./server/users/user.route.js"
app.use('/api/users/', user)

// dummysecure route
/*
import secureRoute from "./server/profile/profile.routes.js"
app.use('/api/user/',secureRoute)
*/
// employee route

// Handle errors.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});
  
  /*
app.get("*", (req, res) => {
    messager(res, 404, "route not found");
  });
  */
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
  