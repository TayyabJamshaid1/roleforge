import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}