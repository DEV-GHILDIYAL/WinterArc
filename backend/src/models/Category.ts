import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  icon: string;
  type: 'boolean' | 'numeric';
  targetValue?: number;
  unit?: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'Flame',
    },
    type: {
      type: String,
      enum: ['boolean', 'numeric'],
      required: true,
    },
    targetValue: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>('Category', categorySchema);
