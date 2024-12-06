// import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query:", err);
        throw new Error(err.message || "Error getting user");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender)
          throw new Error("ALl fields are required");
        const existingUser = await User.findOne({ username });
        if (!existingUser) throw new Error("User doesn't exists");
        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // unique placeholder
        let profileImage =
          gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=[username]`
            : `https://avatar.iran.liara.run/public/girl?username=[username]`;

        const newUser = new User({
          username,
          hashedPassword,
          name,
          gender,
          profilePicture,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log("SignUp Error");
        throw new Error(error.message ?? "interval server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) throw new Error("All fields are required");
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (err) {
        console.error("Error in logout:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default userResolver;
