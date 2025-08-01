import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/email.js";

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
    
    const {email, password} = req.body;
    
    try {
      if(!email || !password) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }

      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);

      if(!isPasswordCorrect) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      //jwt
      generateTokenAndSetCookie(res, user._id);

      user.lastlogin = Date.now();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          ...user._doc,
          password: undefined
        }
      })

    } catch (error) {
      console.log("error in loginUser", error);
      res.status(500).json({ message: "Server error", });
    }
  };
  
  export const logoutUser = async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ success : true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  export const forgotPassword = async (req, res) => {
    
    const {email} = req.body;
    try {
      const user = await User.findOne({ email });

      if(!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      //Generate reset password token
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiredAt = resetTokenExpiresAt;
      await user.save();

      await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`); 

      res.status(200).json({ success: true, message: "Password reset email sent successfully" });

    } catch (error) {
      console.log("error in forgotPassword", error);
      res.status(400).json({ success: false, message: error.message});
    }
  }

  export const resetPassword = async (req, res) => {
    try {
      const {token} = req.params;
      const {password} = req.body;
      
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiredAt: { $gt: Date.now() }
      });

      if(!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiredAt = undefined;

      await user.save();

      await sendResetSuccessEmail(user.email);

      res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.log("Error in resetPassword", error);
      res.status(400).json({ success: false, message: error.message });
    }
    
  }
  