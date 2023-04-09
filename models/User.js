import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  //trim:true mtlb agar koi space wagera de de to wo hat jaega
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true },
  //tc stands for term and condition
  //mtlb term and condition ka check box hoga
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
