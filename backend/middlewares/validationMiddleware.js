const { body, param, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'partner'])
    .withMessage('Role must be admin, user, or partner'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validatePasswordReset = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

// Theatre validation rules
const validateTheatre = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Theatre name must be between 2 and 100 characters'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Movie validation rules
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Movie title is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('duration')
    .isInt({ min: 30, max: 300 })
    .withMessage('Duration must be between 30 and 300 minutes'),
  body('genre')
    .isIn(['Action', 'Comedy', 'Horror', 'Love', 'Patriot', 'Bhakti', 'Thriller', 'Mystery'])
    .withMessage('Invalid genre selected'),
  body('language')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Language is required'),
  body('releaseDate')
    .isISO8601()
    .withMessage('Please provide a valid release date'),
  body('poster')
    .isURL()
    .withMessage('Please provide a valid poster URL'),
  handleValidationErrors
];

// Show validation rules
const validateShow = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Show name is required'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('movie')
    .isMongoId()
    .withMessage('Invalid movie ID'),
  body('theatre')
    .isMongoId()
    .withMessage('Invalid theatre ID'),
  body('totalSeats')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total seats must be between 1 and 1000'),
  body('ticketPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Ticket price must be greater than 0'),
  handleValidationErrors
];

// Booking validation rules
const validateBooking = [
  body('show')
    .isMongoId()
    .withMessage('Invalid show ID'),
  body('seats')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected')
    .custom((seats) => {
      if (seats.length > 10) {
        throw new Error('Cannot book more than 10 seats at once');
      }
      return true;
    }),
  body('totalPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Total price must be greater than 0'),
  handleValidationErrors
];

// Payment validation rules
const validatePayment = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer (in cents)'),
  body('token')
    .notEmpty()
    .withMessage('Payment token is required'),
  handleValidationErrors
];

// Parameter validation rules
const validateMongoId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validateEmail,
  validateTheatre,
  validateMovie,
  validateShow,
  validateBooking,
  validatePayment,
  validateMongoId,
  handleValidationErrors
};
