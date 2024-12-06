// import Transaction from "../models/transaction.model.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
import { users } from "../dummy/data.js";
const userResolver = {
  Query: {
    users: (_, arg) => {
      return users;
    },
    user: (_,{userId}) => {
      return users.find(item => item._id === userId)
    }
  },
};

export default userResolver;
