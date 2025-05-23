import bcrypt from "bcrypt";

export const hashedValue = async (value: string, saltRounds: number = 10) => {
  return bcrypt.hash(value, saltRounds);
};

export const compareHashedvalue = async (
  value: string,
  hashedValue: string
) => {
  return bcrypt.compare(value, hashedValue);
};
