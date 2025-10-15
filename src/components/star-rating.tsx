
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  starSize?: number;
};

export function StarRating({ rating, onRatingChange, readOnly = false, starSize = 24 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={starSize}
          className={cn(
            'cursor-pointer transition-colors',
            readOnly ? 'cursor-default' : 'hover:text-primary',
            (hoverRating >= index || rating >= index) ? 'text-primary fill-primary' : 'text-muted-foreground'
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
