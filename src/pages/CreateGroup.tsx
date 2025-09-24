import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Input, Spinner } from '../shared/components';
import { supabaseAPI } from '../shared/services/supabase';
import { useAuthStore } from '../app/store/useAuthStore';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const group = await supabaseAPI.createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
        max_members: 4, // Fixed for Mario Party (4 players)
      });

      console.log('Grupo creado:', group);

      // Navigate to the group detail page or back to dashboard
      navigate('/dashboard', { replace: true });

      // Show success message
      toast.success(`¡Grupo "${name}" creado exitosamente! Código de invitación: ${group.invite_code}`);

    } catch (error: any) {
      console.error('Error al crear grupo:', error);
      toast.error(error.message || 'Error al crear el grupo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Mario Party League
              </h2>
              <p className="text-gray-600">
                Crea una liga para competir con tus amigos en Mario Party.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                label="Nombre de la Liga"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: MPL Temporada 1"
                required
                maxLength={50}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tu liga de Mario Party..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  Liga pública (otros pueden encontrarla y solicitar unirse)
                </label>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Información importante
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Las ligas están limitadas a 4 jugadores máximo</li>
                        <li>Se generará un código de invitación único</li>
                        <li>Podrás agregar un jugador CPU si son menos de 4</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={!name.trim() || isLoading}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  {isLoading && <Spinner size="sm" className="border-white border-t-transparent" />}
                  <span>{isLoading ? 'Creando...' : 'Crear Liga'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}