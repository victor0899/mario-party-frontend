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
      {/* Images */}
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain object-center"
            />
          </div>
        ))}
      </div>


    </div>
  );
};