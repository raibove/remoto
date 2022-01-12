import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import { config } from "dotenv";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import user route and create user route middelware
import user from "./server/users/user.route.js"
app.use('/api/user/', user)

import secureRoute from "./server/profile/profile.routes.js"
app.use('/api/user/',secureRoute)
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
  