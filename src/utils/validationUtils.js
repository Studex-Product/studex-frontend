export const validateRegistrationForm = (values) => {
  const errors = {};
  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // First name validation
  if (!values.firstName) {
    errors.firstName = "First Name is required";
  } else if (values.firstName.length < 3) {
    errors.firstName = "First Name must be more than 3 characters";
  } else if (!nameRegex.test(values.firstName)) {
    errors.firstName = "First Name can only contain characters";
  }

  // Last name validation
  if (!values.lastName) {
    errors.lastName = "Last Name is required";
  } else if (values.lastName.length < 3) {
    errors.lastName = "Last Name must be more than 3 characters";
  } else if (!nameRegex.test(values.lastName)) {
    errors.lastName = "Last Name can only contain characters";
  }

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Please enter a valid email";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])/.test(values.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*\d)/.test(values.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[@$!%*?&.,])/.test(values.password)) {
    errors.password = "Password must contain at least one special character (@$!%*?&.,)";
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password does not match";
  }

  return errors;
};