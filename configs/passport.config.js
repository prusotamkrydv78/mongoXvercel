import passport from "passport";
import LocalStrategy from "passport-local";
import UserModel from "../models/User.model.js";
import { comparePassword } from "../utils/Auth.utils.js";

export default function passportConfig() {
  passport.use(
    new LocalStrategy.Strategy({ usernameField: "username" }, async function (
      username,
      password,
      done
    ) {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
