exports.notfound = (req,res,next)=>{
    const error = new Error(`Not Found: ${req.originalUrl}`)
    res.status(404)
    next(error)
}
exports.errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(404).json({ success: false, msg: 'Resource not found' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    msg: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🎂' : error.stack,
  });
};

