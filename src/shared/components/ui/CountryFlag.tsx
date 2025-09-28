interface CountryFlagProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'profile';
}

export function CountryFlag({ countryCode, className = '', size = 'md' }: CountryFlagProps) {
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-6',
    xl: 'w-10 h-7',
    profile: 'w-10 h-7'
  };

  // Special case for UN flag (default)
  if (countryCode === 'UN') {
    return (
      <img
        src="/images/flags/UN.svg"
        alt="UN flag"
        className={`${sizeClasses[size]} object-cover rounded-sm ${className}`}
        title="Sin especificar"
      />
    );
  }

  try {
    return (
      <img
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        alt={`${countryCode} flag`}
        className={`${sizeClasses[size]} object-cover rounded-sm ${className}`}
        onError={(e) => {
          // Fallback to UN flag if country flag fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `${sizeClasses[size]} bg-blue-500 rounded-sm flex items-center justify-center ${className}`;
          fallback.innerHTML = '<span class="text-white text-xs font-bold">🌐</span>';
          fallback.title = 'Sin especificar';
          target.parentNode?.replaceChild(fallback, target);
        }}
      />
    );
  } catch (error) {
    return (
      <div
        className={`${sizeClasses[size]} bg-blue-500 rounded-sm flex items-center justify-center ${className}`}
        title="Sin especificar"
      >
        <span className="text-white text-xs font-bold">🌐</span>
      </div>
    );
  }
}