// this util file helps to validate the schema of our db, to chk whether the data coming is in correct format or not.
import Joi from "Joi";
// Joi is a popular library for data validation in Node.js, often used with the npm package manager. It provides a simple and expressive API to define schemas for validating data, ensuring that it meets specific rules and constraints before being processed.

const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    // This chained, declarative syntax is a core part of Joi's design, making it easy to read and write complex validation logic in a clear, expressive way.
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validatelogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
export { validateRegistration, validatelogin };
