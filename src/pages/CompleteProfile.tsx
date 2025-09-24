import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Input, Spinner } from '../shared/components';
import { useAuthStore } from '../app/store/useAuthStore';
import { supabase } from '../shared/lib/supabase';

const MARIO_CHARACTERS = [
  { id: 'mario', name: 'Mario', image: '/images/characters/SMP_Icon_Mario.webp' },
  { id: 'luigi', name: 'Luigi', image: '/images/characters/SMP_Icon_Luigi.webp' },
  { id: 'peach', name: 'Peach', image: '/images/characters/SMP_Icon_Peach.webp' },
  { id: 'bowser', name: 'Bowser', image: '/images/characters/SMP_Icon_Bowser.webp' },
  { id: 'yoshi', name: 'Yoshi', image: '/images/characters/SMPJ_Icon_Yoshi.webp' },
  { id: 'toad', name: 'Toad', image: '/images/characters/SMPJ_Icon_Toad.webp' },
  { id: 'wario', name: 'Wario', image: '/images/characters/SMP_Icon_Wario.webp' },
  { id: 'waluigi', name: 'Waluigi', image: '/images/characters/SMP_Icon_Waluigi.webp' },
  { id: 'rosalina', name: 'Rosalina', image: '/images/characters/SMP_Icon_Rosalina.webp' },
  { id: 'bowser-jr', name: 'Bowser Jr.', image: '/images/characters/SMP_Icon_Jr.webp' },
  { id: 'toadette', name: 'Toadette', image: '/images/characters/SMPJ_Icon_Toadette.webp' },
  { id: 'daisy', name: 'Daisy', image: '/images/characters/MPS_Daisy_icon.webp' },
  { id: 'shy-guy', name: 'Shy Guy', image: '/images/characters/SMP_Icon_Shy_Guy.webp' },
  { id: 'koopa', name: 'Koopa Troopa', image: '/images/characters/SMP_Icon_Koopa.webp' },
  { id: 'goomba', name: 'Goomba', image: '/images/characters/SMP_Icon_Goomba.webp' },
  { id: 'boo', name: 'Boo', image: '/images/characters/SMP_Icon_Boo.webp' },
  { id: 'dk', name: 'Donkey Kong', image: '/images/characters/SMP_Icon_DK.webp' },
  { id: 'birdo', name: 'Birdo', image: '/images/characters/MPS_Birdo_icon.webp' },
  { id: 'pauline', name: 'Pauline', image: '/images/characters/SMPJ_Icon_Pauline.webp' },
  { id: 'ninji', name: 'Ninji', image: '/images/characters/SMPJ_Icon_Ninji.webp' },
  { id: 'spike', name: 'Spike', image: '/images/characters/SMPJ_Icon_Spike.webp' },
  { id: 'monty-mole', name: 'Monty Mole', image: '/images/characters/SMP_Icon_Monty_Mole.webp' }
];


export default function CompleteProfile() {
  const { updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    profilePicture: MARIO_CHARACTERS[0].id
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [nicknameError, setNicknameError] = useState('');

  // Check nickname availability with debounce
  useEffect(() => {
    if (!formData.nickname.trim() || formData.nickname.length < 3) {
      setNicknameStatus('idle');
      setNicknameError('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setNicknameStatus('checking');

      try {
        // Check if nickname exists in Supabase profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('nickname', formData.nickname)
          .maybeSingle();

        console.log('Nickname check response:', { data, error });

        if (error) {
          console.error('Supabase error details:', error);
          // If it's an RLS permission error, we'll assume the nickname is available
          // since we can't check it due to security restrictions
          if (error.code === 'PGRST116' || error.message.includes('RLS')) {
            console.log('RLS restriction detected, allowing nickname');
            setNicknameStatus('available');
            setNicknameError('');
            return;
          }
          throw error;
        }

        if (data) {
          setNicknameStatus('taken');
          setNicknameError('Este nickname no está disponible');
        } else {
          setNicknameStatus('available');
          setNicknameError('');
        }
      } catch (error) {
        console.error('Error checking nickname:', error);
        setNicknameStatus('idle');
        setNicknameError('Error al verificar disponibilidad');
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [formData.nickname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nickname.trim()) {
      toast.error('El nickname es obligatorio');
      return;
    }

    if (formData.nickname.length < 3) {
      toast.error('El nickname debe tener al menos 3 caracteres');
      return;
    }

    if (nicknameStatus === 'taken') {
      toast.error('Este nickname no está disponible');
      return;
    }

    if (nicknameStatus === 'checking') {
      toast.error('Esperando verificación del nickname...');
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        nickname: formData.nickname,
        profile_picture: formData.profilePicture
      };

      await updateProfile(profileData);
      toast.success('¡Perfil completado exitosamente!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error al completar perfil:', error);
      toast.error('Error al guardar el perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-mario text-gray-900 mb-2">
            Completa tu Perfil
          </h2>
          <p className="text-gray-600">
            ¡Bienvenido! Para continuar, necesitamos que completes tu perfil
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Nickname */}
              <div>
                <Input
                  label="Nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="Tu nickname para las partidas"
                  maxLength={20}
                  required
                  error={nicknameError}
                />

                {/* Nickname Status */}
                {formData.nickname.length >= 3 && (
                  <div className="mt-2 flex items-center gap-2">
                    {nicknameStatus === 'checking' && (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-blue-600">Verificando disponibilidad...</span>
                      </>
                    )}
                    {nicknameStatus === 'available' && (
                      <>
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-green-600">¡Nickname disponible!</span>
                      </>
                    )}
                    {nicknameStatus === 'taken' && (
                      <>
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-red-600">Nickname no disponible</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Character Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Personaje Favorito <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {MARIO_CHARACTERS.map((character) => (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, profilePicture: character.id }))}
                      className={`group relative p-2 rounded-lg transition-all duration-200 ${
                        formData.profilePicture === character.id
                          ? 'bg-blue-50 ring-2 ring-blue-400 scale-105 shadow-lg'
                          : 'bg-white hover:bg-gray-50 hover:scale-105 border border-gray-200'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden rounded-md">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-1 text-center">
                        <span className={`text-xs font-medium ${
                          formData.profilePicture === character.id
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}>
                          {character.name}
                        </span>
                      </div>
                      {formData.profilePicture === character.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
              disabled={isSubmitting || nicknameStatus !== 'available' || !formData.nickname.trim()}
            >
              {isSubmitting && <Spinner size="sm" className="border-white border-t-transparent" />}
              <span>{isSubmitting ? 'Guardando...' : 'Completar Perfil'}</span>
            </Button>

            <div className="text-center text-xs text-gray-500 mt-4">
              * Campos obligatorios
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}