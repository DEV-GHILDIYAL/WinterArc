import { Response } from 'express';
import { Category } from '../models/Category.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { includeInactive } = req.query;
    const filter: any = { userId: req.user.userId };

    if (includeInactive !== 'true') {
      filter.active = true;
    }

    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, icon, type, targetValue, unit, active } = req.body;

    const count = await Category.countDocuments({ userId: req.user.userId });

    const category = await Category.create({
      userId: req.user.userId,
      name,
      icon: icon || 'Flame',
      type,
      targetValue: targetValue || 1,
      unit: unit || '',
      active: active !== undefined ? active : true,
      order: count + 1,
    });

    res.status(201).json({ category });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'A category with this name already exists.' });
      return;
    }
    res.status(500).json({ message: error.message || 'Error creating category' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating category' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const category = await Category.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting category' });
  }
};
