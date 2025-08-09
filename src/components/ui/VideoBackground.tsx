import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface VideoBackgroundProps {
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const VideoBackground = () => {
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>
      
      {/* Subtle overlay for better text readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2
        }}
      />
    </div>
  );
};

VideoBackground.displayName = 'VideoBackground';