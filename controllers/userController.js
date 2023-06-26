import asyncHandler from "express-async-handler";
import SubUser from "../models/subUserModel.js";
import User from "../models/userModel.js";
const jwt = require('jsonwebtoken');

const crypto = require('crypto');//generate a random token
const nodemailer = require('nodemailer');


const registeruser = async function (req, res) {
  try {
    const data = req.body;
    const { name, email, passward } = data
    if (!name) {
      return res.status(500).send({ status: false, message: "name is required" })

    }
    if (!(email)) {
      return res.status(500).send({ status: false, message: "email is required" })

    }
    if (!(passward)) {
      return res.status(500).send({ status: false, message: "password is required" })

    }
    const saveddata = await User.create(data);
    res.status(201).send({status:true,data:saveddata})
     
  }
  catch (err) {
    return res.status(500).send({status:false,message:"internal server error"})
  }
}



const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email) {
      return res.status(400).send({ status: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ status: false, message: "Password is required" });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send({ status: false, message: "Invalid email or password" });
    }


    const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });


    res.status(200).send({ status: true, token });

  } catch (err) {
    return res.status(500).send({ status: false, message: "Internal server error" });
  }
}



const forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).send({ status: false, message: "Email is required" });
    }

  
    const resetToken = crypto.randomBytes(20).toString('mmm');


    await User.findOneAndUpdate({ email }, { resetToken });

 
    const transporter = nodemailer.createTransport({
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Password Reset',
      text: `reset your password: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ status: true, message: "Password reset email sent" });

  } catch (err) {
    return res.status(500).send({ status: false, message: "Internal server error" });
  }
}

const resetPassword = async function (req, res) {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
      return res.status(400).send({ status: false, message: "Reset token is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ status: false, message: "New password is required" });
    }


    const user = await User.findOne({ resetToken });


    if (!user) {
      return res.status(401).send({ status: false, message: "Invalid reset token" });
    }


    user.password = newPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).send({ status: true, message: "Password reset successful" });

  } catch (err) {
    return res.status(500).send({ status: false, message: "Internal server error" });
  }
}




 module.exports = { registeruser, login, forgotPassword, resetPassword }







