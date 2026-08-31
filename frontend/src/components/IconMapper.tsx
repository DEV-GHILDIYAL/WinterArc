import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconMapperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconMapper: React.FC<IconMapperProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.Flame;
  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = [
  'Dumbbell',
  'BookOpen',
  'Utensils',
  'Moon',
  'BookMarked',
  'Zap',
  'SmartphoneOff',
  'Code',
  'Flame',
  'HeartPulse',
  'Footprints',
  'Brain',
  'Trophy',
  'Target',
  'Coffee',
  'Smile',
];
