import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '../ui/icons';

interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center',
        className
      )}
    >
      {IconComponent && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

