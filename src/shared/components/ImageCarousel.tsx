import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  autoSlideInterval?: number;
  className?: string;
}

export const ImageCarousel = ({
  images,
  autoSlideInterval = 4000,
  className = ''
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);


  if (images.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-blue-600 to-purple-700 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-mario">Mario Party</h2>
            <p className="text-xl mt-2">League</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex transition-transform duration-500 ease-in-out"
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

    </div>
  );
};