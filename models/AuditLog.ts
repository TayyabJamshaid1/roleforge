import mongoose, { Schema, model, models } from "mongoose";

export interface IAuditLog {
  userId: mongoose.Types.ObjectId;

  action: string;

  ip?: string;

  userAgent?: string;

  metadata?: Record<string, any>;

  createdAt?: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    ip: String,

    userAgent: String,

    metadata: {
      type: Schema.Types.Mixed,
    },
  },

  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

export default models.AuditLog ||
  model<IAuditLog>(
    "AuditLog",

    auditLogSchema,
  );
