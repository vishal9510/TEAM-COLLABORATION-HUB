const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// User registration
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let user = new User({ username, email, password, role });
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, "#######", { expiresIn: '1h' });
    res.status(201).json({ token });

    user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, "#######", { expiresIn: '1h' });

    res.status(200).json({ token });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// Forgot Password - Send Reset Token
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save token and expiration time to the database
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({ msg: 'Email sent' });
    } catch (error) {
      // In case of error, clear the token and expire time
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ msg: 'Email could not be sent' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token to compare with the one in the database
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },  // Check if token has expired
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expire fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
module.exports = { register, login, resetPassword, forgotPassword };