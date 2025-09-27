import { useEffect, useRef } from 'react';

interface LucideIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function LucideIcon({ name, size = 16, className = '', color = 'currentColor' }: LucideIconProps) {
  const iconRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (iconRef.current && (window as any).lucide) {
      // Clear any existing content
      iconRef.current.innerHTML = '';

      // Create the icon
      (window as any).lucide.createIcons({
        icons: {
          [name]: (window as any).lucide[name]
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name]);

  return (
    <i
      ref={iconRef}
      data-lucide={name}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: color,
        display: 'inline-block'
      }}
    />
  );
}