import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userApi } from '../api/users';
import { useAuthStore } from '../store/useAuthStore';
import { Button, Input } from '../components';

export default function Register() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim()) return;

    setIsLoading(true);
    try {
      const user = await userApi.create({ email, name });
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Error al crear la cuenta. Es posible que el email ya esté en uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col lg:flex-row m-0 p-0 overflow-hidden">
      {/* Image Section - 60% */}
      <div className="lg:w-3/5 w-full h-64 lg:h-screen relative overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0">
          <div className="mario-carousel">
            <div className="mario-carousel-slide" style={{backgroundImage: 'url(/images/register/My_Nintendo_SMPJ_thank_you_wallpaper_smartphone.webp)'}}>
              <div className="mario-carousel-overlay"></div>
            </div>
            <div className="mario-carousel-slide" style={{backgroundImage: 'url(/images/register/My_Nintendo_SMPJ_Mario_wallpaper_smartphone.webp)'}}>
              <div className="mario-carousel-overlay"></div>
            </div>
            <div className="mario-carousel-slide" style={{backgroundImage: 'url(/images/register/My_Nintendo_SMPJ_Luigi_wallpaper_smartphone.webp)'}}>
              <div className="mario-carousel-overlay"></div>
            </div>
            <div className="mario-carousel-slide" style={{backgroundImage: 'url(/images/register/My_Nintendo_SMPJ_Peach_wallpaper_smartphone.webp)'}}>
              <div className="mario-carousel-overlay"></div>
            </div>
          </div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-mario mb-4 leading-tight">
              Join the Party!
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-90">
              Track your Mario Party victories and epic moments with friends
            </p>
          </div>
        </div>
      </div>

      {/* Form Section - 40% */}
      <div className="lg:w-2/5 w-full flex items-center justify-center min-h-screen lg:min-h-full p-4 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-mario text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Get started with your gaming journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              size="lg"
            />

            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              size="lg"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full text-base sm:text-lg"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}