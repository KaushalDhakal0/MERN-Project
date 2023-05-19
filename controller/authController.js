const bcrypt = require("bcrypt");
const User = require("../models/user");
const RefreshToken = require("../models/token");
const { respond } = require("../utils/respond.js");
const { STATUS } = require("../utils/constants");
const UserDTO = require("../DTO/userTransform");
const AuthService = require("../services/authServices");
const {
  registerUser,
  loginUser,
  generateTokens,
  setCookies,
  clearCookies,
} = require("../services/authUtils");
// const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const Joi = require("joi");
const register = async (req, res, next) => {
  //Request Body validation
  const userLoginSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.ref("password"),
  });

  const { error } = userLoginSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  //Should Handle validation
  const { name, password, username, email, confirmPassword } = req.body;
  try {
    const emailInUse = await User.exists({ email });

    const usernameInUse = await User.exists({ username });

    if (emailInUse) {
      throw {
        status: STATUS.CONFLICT,
        message: "Email already registered, use another email!",
      };
    }

    if (usernameInUse) {
      throw {
        status: STATUS.CONFLICT,
        message: "Username not available, choose another username!",
      };
    }
  } catch (error) {
    return next(error);
  }

  try {
    const user = await registerUser({ name, password, username, email });

    //Handling tokens
    const { accessToken, refreshToken } = await generateTokens(user);
    res = await setCookies(accessToken, refreshToken, res);
    return respond(
      res,
      STATUS.SUCCESS,
      "New User Created",
      new UserDTO(user),
      ""
    );
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const userLoginSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().required(),
  });

  const { error } = userLoginSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  const { username, password } = req.body;

  let user;
  try {
    user = await loginUser(username, password);
    const { accessToken, refreshToken } = await generateTokens(user);
    res = await setCookies(accessToken, refreshToken, res);
    return respond(
      res,
      STATUS.SUCCESS,
      "Login Successful",
      new UserDTO(user),
      ""
    );
  } catch (error) {
    return next(error);
  }
};
const logout = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res = await clearCookies(res);
    respond(res,STATUS.SUCCESS,"Logout SuccessFul",null,"")
};
const refresh = async (req, res, next) => {
    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const { accessToken, refreshToken} = await generateTokens({
        _id : id
      })

      res = await setCookies(accessToken,refreshToken,res);
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });
    respond(res, STATUS.SUCCESS,"Success",new UserDTO(user),"")
}
module.exports = {
  register,
  login,
  logout,
  refresh,
};
