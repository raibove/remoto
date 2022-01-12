import { User } from "./user.model.js";

export const register_service = async (user_body) => {
  var user = await User.create(user_body);
  return user;
};

export const find_service = async (param) => {
    var user = await User.findOne(param);
    return user;
  };