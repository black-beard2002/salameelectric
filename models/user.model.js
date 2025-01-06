import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required:true,
    },
    isPrime:{
      type:Boolean,
      default:true
    }
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = mongoose.model("User", userSchema); //mongoose will pluralize the name User as users in the db.

export default User;
