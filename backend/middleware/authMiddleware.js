const asyncHandler = require('./asyncHandler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error('Not authorized,token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized,no token');
  }
});
