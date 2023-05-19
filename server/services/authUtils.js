// authUtils.js

const bcrypt = require("bcrypt");
const User = require("../models/user");
const RefreshToken = require("../models/token");
const AuthService = require("../services/authServices");
const { STATUS } = require("../utils/constants");
const EXPIRY_TIME = 1000 * 60 * 60 * 24;
const registerUser = async (userData) => {
  const { name, password, username, email } = userData;

  try {
    const hashedPasswd = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      name,
      password: hashedPasswd,
    });
    const user = await newUser.save();

    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username }).lean();

    if (!user) {
      throw {
        status: STATUS.BAD_REQUEST,
        message: "Username or password is invalid",
      };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw {
        status: STATUS.BAD_REQUEST,
        message: "Username or password is invalid",
      };
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const generateTokens = async (user) => {
  const accessToken = AuthService.signAccessToken({ _id: user._id }, "30m");
  const refreshToken = AuthService.signRefreshToken({ _id: user._id }, "60m");

  try {
    await RefreshToken.updateOne(
      {
        _id: user._id,
      },
      { token: refreshToken },
      { upsert: true }
    );
  } catch (error) {
    throw error;
  }

  return { accessToken, refreshToken };
};

const setCookies = async(accessToken,refreshToken , res) => {
    res.cookie("accessToken", accessToken, {
        maxAge: EXPIRY_TIME,
        httpOnly: true,
      });
    
      res.cookie("refreshToken", refreshToken, {
        maxAge: EXPIRY_TIME,
        httpOnly: true,
      });
    return res;
}
const clearCookies = async(req) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res;
}

module.exports = {
  registerUser,
  loginUser,
  generateTokens,
  setCookies,
  clearCookies
};
