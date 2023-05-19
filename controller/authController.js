const bcrypt = require("bcrypt");
const User = require("../models/user");
const RefreshToken = require("../models/token");
const {respond} = require("../utils/respond.js");
const {STATUS} = require("../utils/constants");
const UserDTO = require("../DTO/userTransform");
const AuthService = require("../services/authServices");
// const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const Joi = require("joi");
const register = async(req,res,next) => {
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
    const {name,password, username, email, confirmPassword} = req.body;
    try {
        const emailInUse = await User.exists({ email });

        const usernameInUse = await User.exists({ username });
        
        if (emailInUse) {
          const error = {
            status: STATUS.CONFLICT,
            message: "Email already registered, use another email!",
          };
  
          return next(error);
        }
  
        if (usernameInUse) {
          const error = {
            status: STATUS.CONFLICT,
            message: "Username not available, choose another username!",
          };
  
          return next(error);
        }
    } catch (error) {
        return next(error);
    }
    let user;
    
    try{
        const hashedPasswd = await bcrypt.hash(password,10);
        const newUser = new User({
            username,
            email,
            name,
            password: hashedPasswd
        });
        user = await newUser.save();

        //Handling tokens
        accessToken = AuthService.signAccessToken({ _id: user._id }, "30m");

        refreshToken = AuthService.signRefreshToken({ _id: user._id }, "60m");

        
    }catch(error){
        return next(error);
    }

    //Storing RefreshToken
    await AuthService.storeRefreshToken(refreshToken, user._id);
    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });
    return respond(res,STATUS.SUCCESS,"New User Created",new UserDTO(user),"");

}

const login = async (req,res,next) =>{
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
      user = await User.findOne({ username: username });

      if (!user) {
        return next({
            status:STATUS.BAD_REQUEST,
            message:"UserName  or password is Invalid"
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next({
            status:STATUS.BAD_REQUEST,
            message:"UserName  or password is Invalid"
        });
      }
      
    } catch (error) {
        return next({
            status:STATUS.INTERNAL_SERVER_ERROR,
            message:"Something Went Wrong!!"
        });
    }
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
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    return respond(res,STATUS.SUCCESS,"Login Successful",new UserDTO(user),"");
}
const logout = async (req,res,next) =>{
    
}
const refresh = async (req,res,next) =>{
    
}

module.exports = {
    register,
    login,
    logout,
    refresh
}