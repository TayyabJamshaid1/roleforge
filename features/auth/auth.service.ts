import { connectToDatabase } from "@/lib/db";
import { createSession } from "@/lib/session";
import { comparePassword, hashPassword } from "@/lib/password";
import User from "@/models/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "user" | "manager";
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

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    authProvider: "credentials",
    isEmailVerified: false,
    isActive: true,
  });

  await createSession({
    userId: user._id.toString(),
    sessionVersion: user.sessionVersion,
  });

  return {
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Account created successfully",
  };
}

export async function loginUserService(data: LoginInput) {
  await connectToDatabase();

  const user = await User.findOne({ email: data.email }).select("+password"); // Include password for verification

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been disabled");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  await createSession({
    userId: user._id.toString(),
    sessionVersion: user.sessionVersion,
  });

  return {
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Login successful",
  };
}