import mongoose, { Schema, model, models } from "mongoose";

export type UserRole = "user" | "manager" | "admin";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  authProvider: "credentials" | "google" | "github";
  providerId?: string;
  sessionVersion: number;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },

    authProvider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },

    providerId: {
      type: String,
    },

    sessionVersion: {
      type: Number,
      default: 1,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);

export default User;