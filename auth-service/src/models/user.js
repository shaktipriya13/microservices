import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
// This is a Mongoose middleware that runs before saving a user document in MongoDB
// Before saving a user, this middleware checks if the password changed. If yes, it hashes it securely using Argon2 so that plain passwords are never stored in the database.

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      return next(error);
    }
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};


// if we want to implement a search functionaliy based on user schema , we do indexing as below

userSchema.index({username:'text'});
// This creates a text index on the username field of the userSchema.
// A text index allows you to perform text-based searches (like search engines).


const User = mongoose.model("User", userSchema);
export default User;

