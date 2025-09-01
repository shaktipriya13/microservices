import logger from "../utils/logger";

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);// It will log if there is any error

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;