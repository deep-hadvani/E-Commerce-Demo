// controllers/authController.ts
import { Request, Response } from 'express';
import { User, UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

import userSchema from '../validationSchema/userSchema'; 
const invalidatedTokens = new Set<string>();

class AuthController {
    // register
    static async register(req: Request, res: Response) {
      const { firstName, lastName, email, password, confirmPassword, mobileNo, address } = req.body;
    
      try {
        await userSchema.validate({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          mobileNo,
          address,
        }, { abortEarly: false });
    
        if (password !== confirmPassword) {
          return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser: User = new UserModel({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobileNo,
          address,
        });

        const savedUser = await newUser.save();
    
        res.json({
          success: true,
          message: 'User registered successfully',
          data: savedUser,
        });
      } catch (error:any) {
        res.status(400).json({ success: false, message: error.errors || 'Validation failed' });
      }
    }

    //   login
     
      async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;
          const user = await UserModel.findOne({ email });
    
          if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
    
          const passwordMatch = await bcrypt.compare(password, user.password);
    
          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
    
          // Generate a new token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default-secret', {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
    
          // Update the user's token in the database
          user.token = token;
          await user.save();
    
          res.json({
            success: true,
            message: 'Login successful',
            token,
          });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      }

    //   forgotPassword
 
      static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
    
        try {
          // Validate input if needed
    
          const user = await UserModel.findOne({ email });
    
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
    
          // Generate a unique token for password reset
          const resetToken = jwt.sign({ userId: user._id }, 'reset-secret', {
            expiresIn: '1h',
          });
    
          const resetLink = `${process.env.RESET_PASSWORD_URL || 'http://localhost:4000/api/user/reset-password/'}${resetToken}`;
    
          // Create a transporter for sending email
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST ,
            port: Number(process.env.EMAIL_PORT) ,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
    
          // Send the reset token to the user's email
          const mailOptions = {
            from: 'h.deep4848@gamil.com', // Your email address
            to: email, // The user's email address
            subject: 'Password Reset', // Email subject
            text: `Click the following link to reset your password: ${resetLink}`, // Email content
          };
    
          await transporter.sendMail(mailOptions);
    
          return res.status(200).json({ success: true, message: 'Password reset token sent to email' });
        } catch (error) {
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
      }

    //   resetPassword

    static async resetPassword(req: Request, res: Response) {
      const { token } = req.params;
  
      try {
        const decoded: any = jwt.verify(token, 'reset-secret');
  
        const userId = decoded.userId;
  
        const { newPassword, confirmPassword } = req.body;
  
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ success: false, message: 'Passwords do not match' });
        } else if (!newPassword || !confirmPassword) {
          return res.status(400).json({ success: false, message: 'Passwords are required' });
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, 12);
  
          // Update the user's password
          const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
          );
  
          if (!updatedUser) {
            return res.status(400).json({ success: false, message: 'User not found' });
          } else {
            return res.status(200).json({
              success: true,
              message: 'Password updated successfully',
            });
          }
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }
    }

    // logout
    static async logout(req: Request, res: Response): Promise<void> {
      try {
        const token = req.headers.authorization?.split(" ")[1]; 

        console.log("req.body.user",req.body.user);
        
  
        if (req.body.user && req.body.user._id) {
          await UserModel.findByIdAndUpdate(
            req.body.user._id,
            { token: null },
            { new: true }
          );
  
          if (token) {
            invalidatedTokens.add(token);
  
            res.status(200).json({ success: true, message: "User logged out successfully" });
          } else {
            res.status(401).json({ success: false, message: "Unauthorized" });
          }
        } else {
          res.status(400).json({ success: false, message: "Invalid user data" });
        }
      } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Logout failed" });
      }
    }

    // getProfileByToken

    static async getProfileByToken(req: Request, res: Response): Promise<void> {
      const token = req.headers.authorization?.split(' ')[1]; // Token sent in the "Authorization" header
  
      try {
        if (token) {
          // Find the admin by the token
          //hello
          const user = await UserModel.findOne({ token });
  
          if (user) {
            // Return the admin's profile
            res.status(200).json({ success: true, user });
          } else {
            res.status(404).json({ success: false, message: 'Your token is expired' });
          }
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        console.error('Error retrieving admin profile:', error);
        res.status(500).json({ success: false, message: 'Profile retrieval failed' });
      }
    }

  // getAllUsers

  static async getAllUsers(req: Request, res: Response) {
    const { page = process.env.PAGE_LIMIT, per_page = process.env.PER_PAGE_LIMIT, sort, search }: any = req.query;
    
    try {
      const offset = (page - 1) * per_page;

      let userQuery = UserModel.find()
        .skip(offset)
        .limit(+per_page)
        .sort(sort ? { [sort]: 'asc' } : undefined)
        .where(
          search
            ? {
                $or: [
                  { firstName: { $regex: new RegExp(search, 'i') } },
                  { lastName: { $regex: new RegExp(search, 'i') } },
                  // Add more search conditions as needed
                ],
              }
            : {}
        );

      const totalCountQuery = UserModel.countDocuments(
        search
          ? {
              $or: [
                { firstName: { $regex: new RegExp(search, 'i') } },
                { lastName: { $regex: new RegExp(search, 'i') } },
                // Add more search conditions as needed
              ],
            }
          : {}
      );

      const [users, totalCount] = await Promise.all([
        userQuery.exec(),
        totalCountQuery.exec(),
      ]);

      res.status(200).json({
        success: true,
        message: 'users fetched successfully',
        data: users,
        total: totalCount,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // getUserById

  async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // userUpdate
static async userUpdate(req: Request, res: Response){
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, mobileNo, address } = req.body;

    // Check if the user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate and update user fields
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = email;
    existingUser.mobileNo = mobileNo;
    existingUser.address = address;

    // Save the updated user
    const updatedUser = await existingUser.save();

    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error("Error during user update:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// userDelete
static async userDelete(req: Request, res: Response){
  try {
    const userId = req.params.id;

    // Check if the user exists
    const deleteUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


}

export default AuthController;
