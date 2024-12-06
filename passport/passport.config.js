import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.models.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async (req, res) => {
  passport.serializeUser((user, done) => {
    console.log("Seralizing User");
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserialing User");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.fineOne({ username });
        if (!user) throw new Error("Invalid Email and Password");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Invalid Email and Password");
        return done(null, user);
      } catch (error) {
        return done(err);
      }
    })
  );
};
