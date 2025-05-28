export const isStrongPassword = (password) => {
  const regex = /^[a-zA-Z0-9@#$!%*?&]{6,}$/;
  return regex.test(password);
};
