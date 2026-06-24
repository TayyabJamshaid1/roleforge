import mongoose, { Schema, model, models } from "mongoose";
export type UserRole = "user" | "manager" | "admin";
export type AuthProvider = "credentials" | "google" | "github";
export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  authProviders: ("credentials" | "google" | "github")[];
  googleId?: string;
  githubId?: string;
  providerId?: string;
  sessionVersion: number;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
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
      select: false, // Exclude password by default
    },

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },

    authProviders: {
      type: [String],
      enum: ["credentials", "google", "github"],
      default: ["credentials"],
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    googleId: {
      type: String,
    },

    githubId: {
      type: String,
    },
    providerId: {
      type: String,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
    sessionVersion: {
      type: Number,
      default: 1,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
