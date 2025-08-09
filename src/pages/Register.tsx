import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components';

export default function Register() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueWithEmail = () => {
    setShowEmailForm(true);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement email registration logic
      console.log('Creating account with email:', email);
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validar si el email es válido para habilitar el botón
  const isEmailValid = email.trim().length > 0 && email.includes('@');

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
          {/* Contenido dinámico con transición */}
          <div className={`transition-all duration-500 ease-in-out ${showEmailForm ? 'opacity-100 transform translate-x-0' : 'opacity-100 transform translate-x-0'}`}>
            
            {!showEmailForm ? (
              // Vista inicial - Botones sociales
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-mario text-gray-800 mb-2">
                    Create Account
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600">
                    Get started with your gaming journey
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Continue with Email Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-base sm:text-lg"
                    onClick={handleContinueWithEmail}
                  >
                    Continue with Email
                  </Button>

                  {/* Or Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="px-4 text-sm text-gray-500">or</div>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full text-base sm:text-lg flex items-center justify-center gap-3 bg-white border border-border-light text-text-dark hover:bg-gray-50"
                      onClick={() => {/* TODO: Google OAuth */}}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full text-base sm:text-lg flex items-center justify-center gap-3 bg-white border border-border-light text-text-dark hover:bg-gray-50"
                      onClick={() => {/* TODO: Apple OAuth */}}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continue with Apple
                    </Button>
                  </div>
                </div>

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
              </>
            ) : (
              // Vista del formulario de email
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-mario text-gray-800 mb-2">
                    Add your email
                  </h1>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-6">
                  <div className="text-left">
                    <Input
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      size="lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    disabled={!isEmailValid || isLoading}
                    className="w-full text-base sm:text-lg"
                  >
                    {isLoading ? 'Creating account...' : 'Create an account'}
                  </Button>
                </form>

                {/* Botón para volver */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Back to options
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}