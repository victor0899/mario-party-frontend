import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Input, Spinner } from '../shared/components';
import { supabaseAPI } from '../shared/services/supabase';
import { useAuthStore } from '../app/store/useAuthStore';
import { useGroupsStore } from '../app/store/useGroupsStore';
import type { RuleSet } from '../shared/types/api';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [ruleSet, setRuleSet] = useState<RuleSet>('classic');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addGroup } = useGroupsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const group = await supabaseAPI.createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
        max_members: 4,
        rule_set: ruleSet,
      });

      // Add the new group to the store so it appears immediately
      addGroup(group);

      navigate('/dashboard', { replace: true });

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
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-mario text-gray-900">
                Crea tu grupo
              </h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                  Sistema de Puntuación
                </label>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="classic"
                      name="ruleSet"
                      value="classic"
                      checked={ruleSet === 'classic'}
                      onChange={(e) => setRuleSet(e.target.value as RuleSet)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="classic" className="ml-3 text-left">
                      <div className="text-sm font-medium text-gray-900">Clásico</div>
                      <div className="text-xs text-gray-500 mt-1">
                        1º: +4pts | 2º: +3pts | 3º: +2pts | 4º: +1pt
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="pro_bonus"
                      name="ruleSet"
                      value="pro_bonus"
                      checked={ruleSet === 'pro_bonus'}
                      onChange={(e) => setRuleSet(e.target.value as RuleSet)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="pro_bonus" className="ml-3 text-left">
                      <div className="text-sm font-medium text-gray-900">ProBonus</div>
                      <div className="text-xs text-gray-500 mt-1">
                        1º: +3pts | 2º: +2pts | 3º: +1pt | 4º: 0pts
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        + Bonos: Rey Minijuegos, Estrellas, Monedas, Victorias
                      </div>
                    </label>
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