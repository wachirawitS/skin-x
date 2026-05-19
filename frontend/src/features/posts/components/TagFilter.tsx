'use client';

import { Tag } from '../types/post.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  tags: Tag[];
  selected: string;
  onChange: (tag: string) => void;
}

export default function TagFilter({ tags, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onChange('')}
        className="focus:outline-none"
      >
        <Badge
          variant={selected === '' ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
        >
          All
        </Badge>
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onChange(tag.name === selected ? '' : tag.name)}
          className="focus:outline-none"
        >
          <Badge
            variant={selected === tag.name ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors px-3 py-1',
              selected === tag.name ? 'hover:bg-primary/90' : 'hover:bg-secondary',
            )}
          >
            {tag.name}
          </Badge>
        </button>
      ))}
    </div>
  );
}
