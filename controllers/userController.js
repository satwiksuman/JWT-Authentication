import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    //To check taki ek email se ek hi registration ho
    const user = await UserModel.findOne({ email: email });

    //To agar user pehle se exist kr rha us email se
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      //Check kro ki sbhi field me data hai ki nhi
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });

            //Create JWT Token...Never add email or password in JWT token
            //Usually we add id in JWT token
            const token = jwt.sign(
              { userId: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.status(201).send({
              status: "success",
              message: "Registration Successful",
              token: token,
            });
          } catch {
            //Never use Console log in production
            console.log(error);
            res.send({ status: "failed", message: "Unable to Register" });
          }
        } else {
          res.send({ status: "failed", message: "Paasword doesn't matched" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);

          if (user.email === email && isMatched) {
            //Generate JWT Token
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.send({
              status: "success",
              message: "Login Success",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email and password doesn't matched",
            });
          }
        } else {
          res.send({ status: "failed", message: "User Not Found" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (err) {
      console.log(err);
      res.send({
        status: "failed",
        message: "Unable to login",
      });
    }
  };

  //Ye tb hoga jb user login hai aur wo apna password change krna chah rha hai
  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;

    if (password && password_confirmation) {
      if (password === password_confirmation) {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        //console.log(req.user._id);
        await userModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "success",
          message: "Password changed successfully",
        });
      } else {
        res.send({ status: "failed", message: "password doesn't matched" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };

  //To get loged user profile
  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  //Send Email to Reset Password
  static sendUserPasswordResetEmail = async (req, res) => {
    //First we will get email
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });

      if (user) {
        //Ek Secret Key bana lete hai jo ki Us User ko bhejenge
        //Aur wo User Id aur JWT secret key ka use krte hue banaenge

        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        });

        //Front-end Link
        //Yha Front-End ka port 3000 diye because ususally front-end ka
        //port 3000 hi hota hai
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);
        res.send({
          status: "success",
          message: "Password Reset Email Sent...Please Check Your Email",
        });
      } else {
        res.send({ status: "failed", message: "User doesn't exists" });
      }
    } else {
      res.send({ status: "failed", message: "Email field is Reuired" });
    }
  };

  //Jab wo Email wala link par User click krega to reset his password then ek frontend khulega
  //Usme new password aur password confimation lenge aur then ye chlega to save that password

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password === password_confirmation) {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.send({
            status: "Success",
            message: "Password changed successfully",
          });
        } else {
          res.send({
            status: "failed",
            message: "New Password and Confirm New Passowrd doesn't matched",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserController;
