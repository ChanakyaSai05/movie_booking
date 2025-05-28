import toast from "react-hot-toast";

/**
 * Formats and displays validation errors from the backend
 * @param {Array|String|Object} errors - The error data from backend
 * @returns {String} - Formatted error message
 */
export const formatAndDisplayErrors = (errors) => {
  // If it's already a string message, just return it
  if (typeof errors === 'string') {
    return errors;
  }

  // If it's an array of validation errors
  if (Array.isArray(errors)) {
    // Group errors by field
    const errorsByField = {};
    errors.forEach(error => {
      if (error.path && error.msg) {
        if (!errorsByField[error.path]) {
          errorsByField[error.path] = [];
        }
        errorsByField[error.path].push(error.msg);
      }
    });

    // Format the errors for display
    const formattedErrors = Object.entries(errorsByField).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return `${fieldName}: ${messages.join(', ')}`;
    });

    return formattedErrors.join('\n');
  }

  // If it's an object with a message property
  if (errors && errors.message) {
    return errors.message;
  }

  // Default fallback
  return "An error occurred. Please try again.";
};

/**
 * Displays multiple error messages as individual toasts
 * @param {Array|String|Object} errors - The error data from backend
 */
export const showErrorToasts = (errors) => {
  // If it's already a string message, show it
  if (typeof errors === 'string') {
    toast.error(errors);
    return;
  }

  // If it's an array of validation errors
  if (Array.isArray(errors)) {
    console.log("came here")
    // Group errors by field to avoid duplicate field names
    const errorsByField = {};
    errors.forEach(error => {
      if (error.path && error.msg) {
        if (!errorsByField[error.path]) {
          errorsByField[error.path] = [];
        }
        errorsByField[error.path].push(error.msg);
      }
    });

    // Show each field's errors as separate toasts
    Object.entries(errorsByField).forEach(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      messages.forEach(message => {
        toast.error(`${fieldName}: ${message}`, {
          duration: 6000, // Show for 6 seconds since there might be multiple
        });
      });
    });
    return;
  }

  // If it's an object with a message property
  if (errors && errors.message) {
    toast.error(errors.message);
    return;
  }

  // Default fallback
  toast.error("An error occurred. Please try again.");
};

/**
 * Extracts error message from axios error response
 * @param {Object} error - Axios error object
 * @returns {Array|String} - Extracted errors
 */
export const extractErrorFromResponse = (error) => {
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    // Check for validation errors array
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors;
    }
    
    // Check for single error message
    if (data.message) {
      return data.message;
    }
    
    // Check for error string
    if (data.error) {
      return data.error;
    }
  }
  
  // Fallback to error message
  return error.message || "An unexpected error occurred";
};
