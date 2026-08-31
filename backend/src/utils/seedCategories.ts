import { Category } from '../models/Category.js';
import { Types } from 'mongoose';

export const DEFAULT_CATEGORIES = [
  {
    name: 'Workout',
    icon: 'Dumbbell',
    type: 'boolean' as const,
    targetValue: 1,
    unit: 'session',
    order: 1,
  },
  {
    name: 'Study / Deep Work',
    icon: 'BookOpen',
    type: 'numeric' as const,
    targetValue: 4,
    unit: 'hrs',
    order: 2,
  },
  {
    name: 'Diet / Clean Eating',
    icon: 'Utensils',
    type: 'boolean' as const,
    targetValue: 1,
    unit: 'day',
    order: 3,
  },
  {
    name: 'Sleep 7+ Hours',
    icon: 'Moon',
    type: 'boolean' as const,
    targetValue: 1,
    unit: 'hrs',
    order: 4,
  },
  {
    name: 'Book Reading',
    icon: 'BookMarked',
    type: 'numeric' as const,
    targetValue: 20,
    unit: 'pages',
    order: 5,
  },
  {
    name: 'Cold Shower',
    icon: 'Zap',
    type: 'boolean' as const,
    targetValue: 1,
    unit: 'times',
    order: 6,
  },
  {
    name: 'No Doomscrolling',
    icon: 'SmartphoneOff',
    type: 'boolean' as const,
    targetValue: 1,
    unit: 'day',
    order: 7,
  },
  {
    name: 'Skill Building',
    icon: 'Code',
    type: 'numeric' as const,
    targetValue: 2,
    unit: 'hrs',
    order: 8,
  },
];

export const seedDefaultCategories = async (userId: Types.ObjectId | string) => {
  const categoriesToCreate = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    userId,
    active: true,
  }));

  return await Category.insertMany(categoriesToCreate);
};
