import { forwardRef, type HTMLAttributes } from 'react';
import { containerVariants } from '../../design-system/variants';
import { cn } from '../../utils/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: keyof typeof containerVariants.maxWidth;
  centered?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = 'lg', centered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          containerVariants.base,
          containerVariants.maxWidth[maxWidth],
          centered && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';