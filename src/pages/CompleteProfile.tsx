import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components';
import { useAuthStore } from '../store/useAuthStore';

const PROFILE_PICTURES = [
  '👤', '😀', '😎', '🤔', '😊', '🥳', '🤩', '😇',
  '🔥', '⭐', '🎮', '🏆', '🎯', '🎨', '🌟', '💫'
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
    profilePicture: PROFILE_PICTURES[0],
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
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Completa tu Perfil
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¡Bienvenido! Para continuar, necesitamos que completes tu perfil
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil *
              </label>
              <div className="grid grid-cols-8 gap-2">
                {PROFILE_PICTURES.map((pic) => (
                  <button
                    key={pic}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, profilePicture: pic }))}
                    className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                      formData.profilePicture === pic
                        ? 'bg-blue-500 text-white scale-110 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {pic}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Perfil'}
          </Button>

          <div className="text-center text-xs text-gray-500">
            * Campos obligatorios
          </div>
        </form>
      </div>
    </div>
  );
}