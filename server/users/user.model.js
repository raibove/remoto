// https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const user_schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// to hash password
/*

user_schema.pre("save", async function (next){
  const user = this;
  const hash = await bycrpt.hash(this.password, 10);

  this.password = hash;
  next();
  }
);
*/

user_schema.pre("save", async function (next) {
  if (!this.isModified || !this.isNew) {
    next();
  } else this.isModified("password");
  if (this.password) this.password = bcrypt.hashSync(String(this.password), 12);
  next();
});

// for checking if passowrd is valid while login
user_schema.methods.isValidPassword = async function(password){
  const user= this;
  const compare = await bycrypt.compare(password, user.password);
  return compare;
}

export const User = mongoose.model("User", user_schema);
