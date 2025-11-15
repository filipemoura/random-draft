import React from 'react';
import { Star, Hand, Baby, Trash2, Shuffle } from 'lucide-react';

export const CaptainIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <Star className={className} fill="currentColor" />
);

export const GoalkeeperIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <Hand className={className} />
);

export const ChildIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <Baby className={className} />
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <Trash2 className={className} />
);

export const ShuffleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <Shuffle className={className} />
);