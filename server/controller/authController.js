const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken, generateOtpToken, verifyOtpToken } = require('../utils/utility');
require('dotenv').config();
const { mailFormat, setOtp, verifyOtp, generateOtp } = require('../utils/otp');

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendotp = async (req, res) => {
  console.log('request received');
  const { email, type } = req.body;

  // Validate required fields
  if (!email || !type) {
    return res.status(400).json({
      success: false,
      message: 'Email and type are required to send OTP'
    });
  }

  // Validate type
  if (!['signup', 'reset'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP type. Must be "signup" or "reset".'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.'
    });
  }

  try {
    // Check user existence based on type
    const userCheck = await pool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );
    const userExists = userCheck.rows.length > 0;

    if (type === 'signup' && userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already registered with this email. Please login.'
      });
    }

    if (type === 'reset' && !userExists) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please sign up.'
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Store OTP (await in case setOtp is async)
    const result = await setOtp({ email, otp, type });
    if (!result || !result.status) {
      return res.status(500).json({
        success: false,
        message: (result && result.message) || 'Failed to store OTP. Please try again.'
      });
    }

    // Send OTP email
    await transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for requested action',
      html: mailFormat(otp),
    });

    // Generate short-lived OTP token
    const otpToken = generateOtpToken({ email, type });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otpToken,
    });

  } catch (error) {
    console.error('Mail sending failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again after a while.',
      error: error.message
    });
  }
};

const signup = async (req, res) => {
  console.log("api hit");
  const { name, email, password, cnfpassword, phone_number, dob, otpToken } = req.body;

  if (!otpToken || !name || !email || !password || !cnfpassword || !phone_number || !dob) {
    return res.status(400).json({
      success: false,
      message: "All fields, including date of birth and OTP token, are required.",
    });
  }

  if (password !== cnfpassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match.",
    });
  }

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
    });
  }

  try {
    const decoded = verifyOtpToken(otpToken);
    if (decoded.type !== "signup" || decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP token for signup.",
      });
    }

    const emailCheck = await pool.query(
      "SELECT user_id FROM users WHERE email = $1", [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email.",
      });
    }

    const phoneCheck = await pool.query(
      "SELECT user_id FROM users WHERE phone_number = $1", [phone_number]
    );
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, phone_number, dob, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, name, email, phone_number, dob, role, created_at`,
      [name, email, hashedPassword, phone_number, dob, "user"] // ✅ "user" not "citizen"
    );

    const newUser = userResult.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      token,
      user: newUser,
    });

  } catch (err) {
    console.error("Signup error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP token.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error creating user.",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input early
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  try {
    // Fetch user by email
    const result = await pool.query(
      'SELECT user_id, name, email, password, phone_number, role, department, created_at FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // If user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist, please sign up.',
      });
    }

    // Compare password securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Remove password from response
    const { password: _, ...safeUser } = user;

    // Generate auth token
    const token = generateToken(safeUser);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: token,
      user: safeUser,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error logging in.',
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, password, otpToken } = req.body;

  // Validate inputs
  if (!email || !password || !otpToken) {
    return res.status(400).json({
      success: false,
      message: "Email, new password, and otpToken are required.",
    });
  }

  try {
    // 1. Verify OTP token
    const decoded = verifyOtpToken(otpToken);

    // 2. Validate token contents
    if (!decoded || decoded.type !== 'reset' || decoded.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP verification token.",
      });
    }

    // 3. Check if user exists
    const result = await pool.query(
      'SELECT user_id, email FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 4. Check password strength
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong (min 8 chars, uppercase, lowercase, number, special character).",
      });
    }

    // 5. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Update password in DB
    const updateResult = await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING user_id, name, email, phone_number, role, department',
      [hashedPassword, email]
    );

    const updatedUser = updateResult.rows[0];

    // 7. Generate login token after reset
    const token = generateToken(updatedUser);
    
    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
      token: token,
      user: updatedUser,
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: err.message,
    });
  }
};

const verifyOtpCont = async (req, res) => {
  const { email, otp, type } = req.body;

  if (!email || !otp || !type) {
    return res.status(400).json({ success: false, message: "Email, OTP, and type are required." });
  }

  try {
    // Verify OTP in your in-memory Map store
    const result = verifyOtp({ email, otp, type });

    if (!result.status) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // OTP is valid – generate otpToken for further use
    const otpToken = generateOtpToken({ email, type });
    
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      otpToken: otpToken,
    });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: err.message,
    });
  }
};

// Optional: Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const result = await pool.query(
      `SELECT user_id, name, email, phone_number, role, department, created_at, updated_at 
       FROM users 
       WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Optional: Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { name, phone_number } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone_number = COALESCE($2, phone_number),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3
       RETURNING user_id, name, email, phone_number, role, department, created_at, updated_at`,
      [name, phone_number, userId]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Optional: Change password
const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.user_id;
  
  if (!current_password || !new_password) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }
  
  // Check password strength
  if (!strongPasswordRegex.test(new_password)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long, include uppercase, lowercase, number, and special character.'
    });
  }
  
  try {
    // Get current password hash
    const result = await pool.query(
      'SELECT password FROM users WHERE user_id = $1',
      [userId]
    );
    
    const user = result.rows[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [hashedPassword, userId]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  sendotp,
  verifyOtpCont,
  login,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
};