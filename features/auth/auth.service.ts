import { connectToDatabase } from "@/lib/db";
import { hashPassword, comparePassword } from "@/lib/password";
import User from "@/models/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "manager" | "admin";
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUserService(data: RegisterInput) {
  await connectToDatabase();

  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }
  if (data.role === "admin") {
    throw new Error("Admin registration is not allowed");
  }
  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,

    role: data.role,

    authProvider: "credentials",
    isEmailVerified: false,
  });

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function loginUserService(data: LoginInput) {
  await connectToDatabase();

  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    sessionVersion: user.sessionVersion,
  };
}
