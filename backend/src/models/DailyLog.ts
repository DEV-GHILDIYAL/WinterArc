import { Schema, model, Document, Types } from 'mongoose';

export interface ILogEntry {
  categoryId: Types.ObjectId;
  value: number; // 1 or 0 for boolean, numeric count for numeric
  completed: boolean;
}

export interface IDailyLog extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD format
  entries: ILogEntry[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const logEntrySchema = new Schema<ILogEntry>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const dailyLogSchema = new Schema<IDailyLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    entries: [logEntrySchema],
    note: {
      type: String,
      default: '',
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog = model<IDailyLog>('DailyLog', dailyLogSchema);
