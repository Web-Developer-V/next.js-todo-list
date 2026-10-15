export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const isValidPassword = (password: string) => {
  return passwordPattern.test(password);
};
