export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateTaskTitle = (title) => {
  return title.trim().length >= 3 && title.trim().length <= 100;
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};