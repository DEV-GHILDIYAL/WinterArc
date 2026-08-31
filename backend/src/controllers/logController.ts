import { Response } from 'express';
import { DailyLog } from '../models/DailyLog.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { from, to } = req.query;
    const filter: any = { userId: req.user.userId };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = String(from);
      if (to) filter.date.$lte = String(to);
    }

    const logs = await DailyLog.find(filter).sort({ date: -1 });
    res.status(200).json({ logs });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching daily logs' });
  }
};

export const getLogByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { date } = req.params;
    const log = await DailyLog.findOne({ userId: req.user.userId, date });

    res.status(200).json({ log: log || null });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching log for date' });
  }
};

export const saveDailyLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { date } = req.params;
    const { entries, note } = req.body;

    const updatedLog = await DailyLog.findOneAndUpdate(
      { userId: req.user.userId, date },
      {
        $set: {
          entries,
          note: note || '',
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Log saved successfully', log: updatedLog });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error saving daily log' });
  }
};
