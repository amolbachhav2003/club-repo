import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";

export const signupUser = async (req, res) => {
  const {email, password, name} = req.body;

    try {
      if(!email || !password || !name) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }
      const userAlreadyExists = await User.findOne({email});

      if(userAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit random number for otp verification

      const user = new User({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt: Date.now() +  15 * 60 * 1000 
      })

      await user.save();

      //jwt
      generateTokenAndSetCookie(res, user._id);

      //send verification email
      await sendVerificationEmail(user.email, verificationToken)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          ...user._doc,
          password: undefined,  // hide password from response
        },
      })

    } catch (error) {
      res.status(500).json({ message: "Server error"});
    }
  };

  export const verifyEmail = async (req, res) => {
    try {
      const {code} = req.body;

      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() }
      });

      if(!user) {
        return res.status(400).json({success: false, message: "Invalid verification code"});
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      await sendWelcomeEmail(user.email, user.name);

      res.status(200).json({
        success: true, 
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined
        }
      });

    } catch (error) {
      res.status(500).json({ message: "Server error"});
    }
  }
  
  export const loginUser = async (req, res) => {
    try {
      res.send("User logged in successfully");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const logoutUser = async (req, res) => {
    try {
      res.send("User logged out successfully");res.send
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  