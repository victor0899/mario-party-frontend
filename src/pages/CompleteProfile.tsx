import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components';
import { useAuthStore } from '../store/useAuthStore';

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

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Cuba', 'Ecuador', 'El Salvador', 'España', 'Guatemala', 'Honduras',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico',
  'República Dominicana', 'Uruguay', 'Venezuela', 'Estados Unidos',
  'Canadá', 'Otro'
];

const MINIGAMES = [
  'Platform Peril', 'Tug o\' War', 'Musical Mushroom', 'Coin Block Blitz',
  'Jump Man', 'Piranha\s Pursuit', 'Treasure Diving', 'Desert Dash',
  'Shy Guy Says', 'Bumper Balls', 'Crane Game', 'Face Lift',
  'Crazy Cutters', 'Hot Rope Jump', 'Paddle Battle', 'Hexagon Heat'
];

export default function CompleteProfile() {
  const { updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    profilePicture: MARIO_CHARACTERS[0].id,
    birthDate: '',
    nationality: '',
    favoriteMinigame: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nickname.trim()) {
      alert('El nickname es obligatorio');
      return;
    }

    if (!formData.birthDate) {
      alert('La fecha de nacimiento es obligatoria');
      return;
    }

    if (!formData.nationality) {
      alert('La nacionalidad es obligatoria');
      return;
    }

    if (!formData.favoriteMinigame) {
      alert('Debes seleccionar tu minijuego favorito');
      return;
    }

    if (!formData.bio.trim()) {
      alert('Cuéntanos algo sobre ti');
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        nickname: formData.nickname,
        profile_picture: formData.profilePicture,
        birth_date: formData.birthDate,
        nationality: formData.nationality,
        favorite_minigame: formData.favoriteMinigame,
        bio: formData.bio
      };

      await updateProfile(profileData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error al completar perfil:', error);
      alert('Error al guardar el perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 13); // Minimum 13 years old

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
            <div className="space-y-4">
              {/* Nickname */}
              <Input
                label="Nickname *"
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="Tu nickname para las partidas"
                maxLength={20}
                required
              />

              {/* Character Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Personaje Favorito *
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

              {/* Birth Date */}
              <Input
                label="Fecha de Nacimiento *"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                max={maxBirthDate.toISOString().split('T')[0]}
                required
              />

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidad *
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona tu país</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorite Minigame */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minijuego Favorito *
                </label>
                <select
                  value={formData.favoriteMinigame}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteMinigame: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona tu minijuego favorito</option>
                  {MINIGAMES.map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos de ti *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe tu estilo de juego, experiencia con Mario Party, o cualquier cosa interesante sobre ti..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 caracteres
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Completar Perfil'}
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