import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //Dekho Token me starting me ek bearer krke hota hai then space hota hai
      //then JWT token hota hai

      //To hm pehle us poore ko authorization me le liye aur agar authorization
      //me kuch aaya then hm check kiye ki kya wo bearer se suru ho rha
      //hai ki nhi, agar wo baearer se bhi suru ho rha
      //then hm usko space ke basis par split kr denge
      //to kya hoga ki array me 0th index par bearer aur 1st index
      //par wo token hoga

      token = authorization.split(" ")[1];

      //Verify Token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      //Get User from Token
      //Yha database se user ka password chor ke sabkuch de dete hai
      req.user = await userModel.findById(userId).select("-password");
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ status: "failed", message: "Unathorized User" });
    }
  }

  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unathorized User, No token" });
  }
};

export default checkUserAuth;
