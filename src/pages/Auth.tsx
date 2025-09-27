import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageCarousel } from '../shared/components';
import { AuthForm, SocialAuth } from '../features/auth';

const carouselImages = [
  '/images/carousel/1600px-SMPJ_Daisy_and_Waluigi.webp',
  '/images/carousel/1600px-SMPJ_Luigi_and_Para-Biddybuds.webp',
  '/images/carousel/SMPJ_Green_Toad.webp',
  '/images/carousel/SMPJ_Mario_and_Bowser_Jr.webp',
  '/images/carousel/SMPJ_Peach_Items.webp',
  '/images/carousel/SMPJ_Rhythm_Cooking.webp'
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = () => {
  };

  return (
    <div className="h-screen flex w-full overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-lg h-3/4">
          <ImageCarousel
            images={carouselImages}
            className="w-full h-full"
            autoSlideInterval={5000}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white h-full p-4 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-mario text-gray-900 mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Bienvenido de vuelta' : 'Únete a Mario Party League'}
              </p>
            </div>

            <AuthForm
              isLogin={isLogin}
              onToggleMode={toggleMode}
              onSuccess={handleSuccess}
            />

            <div className="mt-4">
              <SocialAuth onSuccess={handleSuccess} />
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-700">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </button>
              </p>
            </div>

            <div className="mt-3 text-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>

          <div className="lg:hidden mt-8">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-gray-600 text-sm">Mario Party League</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}