const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || res.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Something went wrong",
    errors: err.messages || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;
