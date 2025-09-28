import { cn } from '../../utils/cn';

interface WarioLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  textClassName?: string;
  fullScreen?: boolean;
}

export function WarioLoader({
  text = 'Cargando...',
  size = 'md',
  className,
  textClassName,
  fullScreen = false
}: WarioLoaderProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-white'
    : 'flex items-center justify-center py-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img
            src="/images/others/loading.webp"
            alt="Wario Loading"
            className={cn(
              'object-contain animate-bounce',
              sizeClasses[size]
            )}
          />
        </div>
        <p className={cn(
          'font-mario text-gray-800 text-center',
          textSizeClasses[size],
          textClassName
        )}>
          {text}
        </p>
      </div>
    </div>
  );
}

export default WarioLoader;