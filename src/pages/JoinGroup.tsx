import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Input, Container } from '../shared/components';
import { supabaseAPI } from '../shared/services/supabase';
import { supabase } from '../shared/lib/supabase';
import { useAuthStore } from '../app/store/useAuthStore';
import type { Group } from '../shared/types/api';

export default function JoinGroup() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [manualCode, setManualCode] = useState('');
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();


  useEffect(() => {
    if (inviteCode) {
      lookupGroup(inviteCode);
    }
  }, [inviteCode]);

  const lookupGroup = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // We need to create a method to find group by invite code
      const foundGroup = await searchGroupByInviteCode(code.trim());
      setGroup(foundGroup);
    } catch (error: any) {
      console.error('Error al buscar grupo:', error);
      setError('Código de invitación inválido o grupo no encontrado');
      setGroup(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary method - we'll need to add this to the API
  const searchGroupByInviteCode = async (code: string): Promise<Group> => {
    // This is a simple query to find group by invite code
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        members:group_members(*),
        games(id, status, played_at)
      `)
      .eq('invite_code', code.toUpperCase())
      .single();

    if (error) throw error;
    return data;
  };

  const joinGroup = async () => {
    if (!group || !user) return;

    // Check if user is already a member
    const isAlreadyMember = group.members?.some(member =>
      member.user_id === user.id && member.status === 'active'
    );

    if (isAlreadyMember) {
      alert('Ya eres miembro de este grupo');
      navigate(`/groups/${group.id}`);
      return;
    }

    // Check if group is full
    const currentMembers = group.members?.filter(m => m.status === 'active').length || 0;
    if (currentMembers >= group.max_members) {
      setError('Este grupo ya está lleno');
      return;
    }

    setIsJoining(true);
    try {
      await supabaseAPI.joinGroup({ invite_code: group.invite_code });
      alert(`¡Te has unido exitosamente al grupo "${group.name}"!`);
      navigate(`/groups/${group.id}`);
    } catch (error: any) {
      console.error('Error al unirse al grupo:', error);
      setError('Error al unirse al grupo: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsJoining(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container maxWidth="sm" className="py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Unirse a Grupo
            </h1>
            <p className="text-gray-600 mb-6">
              Necesitas iniciar sesión para unirte a un grupo
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Unirse a Grupo</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {!inviteCode && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Código de Invitación
                </h2>
                <div className="space-y-4">
                  <Input
                    type="text"
                    label="Ingresa el código"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="Ej: 2AFD74C0"
                    maxLength={8}
                  />
                  <Button
                    variant="primary"
                    onClick={() => lookupGroup(manualCode)}
                    disabled={!manualCode.trim() || isLoading}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Buscar Grupo
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="text-red-600 text-sm">{error}</div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8">
                <div className="text-gray-500">Buscando grupo...</div>
              </div>
            )}

            {group && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎮</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {group.name}
                  </h2>
                  {group.description && (
                    <p className="text-gray-600 mb-4">{group.description}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Miembros:</span>
                      <span className="font-medium ml-2">
                        {group.members?.filter(m => m.status === 'active').length || 0}/{group.max_members}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Partidas:</span>
                      <span className="font-medium ml-2">{group.games?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium ml-2">
                        {group.is_public ? '🌐 Público' : '🔒 Privado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Código:</span>
                      <span className="font-mono text-sm font-medium ml-2">
                        {group.invite_code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={joinGroup}
                    disabled={isJoining}
                    isLoading={isJoining}
                    className="w-full"
                  >
                    {isJoining ? 'Uniéndose...' : `Unirse a ${group.name}`}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/groups')}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Al unirte podrás participar en partidas y competir en la liga
                  </p>
                </div>
              </div>
            )}

            {!group && !isLoading && !error && !inviteCode && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  Ingresa un código de invitación para buscar el grupo
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 text-sm">
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}