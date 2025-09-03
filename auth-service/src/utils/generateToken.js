import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

// use of crypto package?
// The crypto package is a built-in Node.js module that provides cryptographic functionalities, including hashing, encryption, decryption, and secure key generation.

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username, // Fixed typo from _username to username
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); //This part is like a sticky note you put on your new key. It says, "This key will stop working in exactly one week."

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

export { generateTokens };
