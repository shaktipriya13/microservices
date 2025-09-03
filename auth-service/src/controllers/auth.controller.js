import RefreshToken from "../models/RefreshToken.js";
import { User } from "../models/user.js";
import { generateTokens } from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { validateRegistration, validatelogin } from "../utils/validation.js";

//user registration
const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    //validate the schema
    const { error } = validateRegistration(req.body); //we would be getting our info. in request body
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] }); //we are using or operator to chk if the user is existting or not
    // if eihter of username or email is prsnt then the user is not allowed to register again
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();
    logger.info(`User saved successfully: ${user._id}`);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (e) {
    logger.error("Registration error occurred", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//user login
const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");
  try {
    const { error } = validatelogin(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // user valid password or not
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (e) {
    logger.error("Login error occurred", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//refresh token
const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      logger.warn("Invalid refresh token provided");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      logger.warn("Expired refresh token");
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(401).json({
        success: false,
        message: "Expired refresh token",
      });
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
      logger.warn("User not found");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    //delete the old refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    logger.error("Refresh token error occurred", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout
const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const storedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });
    if (!storedToken) {
      logger.warn("Invalid refresh token provided");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    logger.info("Refresh token deleted for logout");

    res.json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (e) {
    logger.error("Error while logging out", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { registerUser, loginUser, refreshTokenUser, logoutUser };
