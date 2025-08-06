export const isPassword = (
  password: string,
  {
    min,
    max,
  }: {
    min?: number;
    max?: number;
  } = {
    min: 12,
    max: 64,
  },
) => {
  return (
    hasMinLength(password, min) &&
    doesNotExceedMaxLength(password, max) &&
    hasUpperCase(password) &&
    hasLowerCase(password) &&
    hasNumber(password) &&
    hasSpecialCharacter(password)
  );
};

export const hasMinLength = (string: string, min: number = 0) => {
  return string.length >= min;
};

export const doesNotExceedMaxLength = (string: string, max: number = 0) => {
  return max === 0 ? true : string.length <= max;
};

export const hasUpperCase = (string: string) => {
  return /[A-Z]/.test(string);
};

export const hasLowerCase = (string: string) => {
  return /[a-z]/.test(string);
};

export const hasNumber = (string: string) => {
  return /\d/.test(string);
};

export const hasSpecialCharacter = (string: string) => {
  return /[\W_]/.test(string);
};
