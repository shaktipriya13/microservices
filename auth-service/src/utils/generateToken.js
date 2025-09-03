import jwt from "jsonwebtoken";
// use of crypto package?
// The crypto package is a built-in Node.js module that provides cryptographic functionalities, including hashing, encryption, decryption, and secure key generation.

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user._username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );

  const refreshToken = crypto.ranadomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); //This part is like a sticky note you put on your new key. It says, "This key will stop working in exactly one week."

  await refreshToken.create({
        token:refreshToken,
        user:user_id,
        expiresAt
  })
  return {accessToken,refreshToken};
};

export {generateTokens};