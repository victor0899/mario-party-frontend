import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { supabaseAPI } from '../api/supabase';
import { useAuthStore } from '../store/useAuthStore';
import type { Group } from '../types/api';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCPU, setShowAddCPU] = useState(false);
  const [cpuName, setCpuName] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      loadGroup();
    }
  }, [id]);

  const loadGroup = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const groupData = await supabaseAPI.getGroup(id);
      setGroup(groupData);
    } catch (error: any) {
      console.error('Error al cargar grupo:', error);
      alert('Error al cargar el grupo');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  const addCPUMember = async () => {
    if (!id || !cpuName.trim()) return;

    try {
      await supabaseAPI.addCPUMember({
        group_id: id,
        cpu_name: cpuName.trim(),
        cpu_avatar: '🤖',
      });

      alert(`CPU "${cpuName}" agregado exitosamente`);
      setCpuName('');
      setShowAddCPU(false);
      loadGroup(); // Reload group data
    } catch (error: any) {
      console.error('Error al agregar CPU:', error);
      alert('Error al agregar CPU: ' + (error.message || 'Error desconocido'));
    }
  };

  const copyInviteCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.invite_code);
      alert(`Código de invitación copiado: ${group.invite_code}`);
    }
  };

  const copyInviteLink = () => {
    if (group) {
      const inviteLink = `${window.location.origin}/groups/join/${group.invite_code}`;
      navigator.clipboard.writeText(inviteLink);
      alert('Enlace de invitación copiado al portapapeles');
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Cargando...</div>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Cargando grupo...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grupo no encontrado</h2>
            <Link to="/groups">
              <Button variant="primary">Volver a Mis Grupos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isGroupFull = (group.members?.length || 0) >= group.max_members;
  const humanMembers = group.members?.filter(m => !m.is_cpu) || [];
  const cpuMembers = group.members?.filter(m => m.is_cpu) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 text-sm">{group.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {group.members?.length || 0}/{group.max_members} miembros
            </span>
            <Link to="/groups" className="text-gray-600 hover:text-gray-800">
              ← Mis Grupos
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Members & Invitations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Miembros ({group.members?.length || 0}/{group.max_members})
              </h2>

              <div className="space-y-3">
                {/* Human Members */}
                {humanMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {member.user_id === user.id ? 'Tú' : `Usuario ${member.user_id}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.user_id === group.creator_id && '👑 Creador'}
                      </div>
                    </div>
                  </div>
                ))}

                {/* CPU Members */}
                {cpuMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      🤖
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{member.cpu_name}</div>
                      <div className="text-sm text-purple-600">CPU Player</div>
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: group.max_members - (group.members?.length || 0) }).map((_, index) => (
                  <div key={`empty-${index}`} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                      ?
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-500">Slot disponible</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add CPU Button */}
              {!isGroupFull && (
                <div className="mt-4">
                  {!showAddCPU ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowAddCPU(true)}
                    >
                      🤖 Agregar CPU
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={cpuName}
                        onChange={(e) => setCpuName(e.target.value)}
                        placeholder="Nombre del CPU (ej: Mario CPU)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={20}
                      />
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={addCPUMember}
                          disabled={!cpuName.trim()}
                          className="flex-1"
                        >
                          Agregar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setShowAddCPU(false);
                            setCpuName('');
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Invitation */}
            {!isGroupFull && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Invitar Jugadores
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Invitación
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-lg font-mono bg-gray-100 px-3 py-2 rounded border">
                        {group.invite_code}
                      </code>
                      <button
                        onClick={copyInviteCode}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Copiar código"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={copyInviteLink}
                    >
                      📤 Copiar Enlace de Invitación
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      Comparte este enlace con tus amigos para que se unan
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Games & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="primary"
                size="lg"
                className="h-16"
                onClick={() => navigate(`/games/new?group=${group.id}`)}
                disabled={!isGroupFull}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🎮</div>
                  <div>Nueva Partida</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16"
                onClick={() => navigate(`/groups/${group.id}/leaderboard`)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div>Tabla de Posiciones</div>
                </div>
              </Button>
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Partidas Recientes
              </h2>

              {!group.games || group.games.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No hay partidas registradas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {!isGroupFull
                      ? `Necesitas ${group.max_members - (group.members?.length || 0)} jugador(es) más para empezar a jugar`
                      : 'Registra tu primera partida para empezar la competencia'
                    }
                  </p>
                  {isGroupFull && (
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/games/new?group=${group.id}`)}
                    >
                      Registrar Primera Partida
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {group.games.slice(0, 5).map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">
                          Partida {game.id?.slice(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(game.played_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.status === 'approved' ? 'bg-green-100 text-green-800' :
                          game.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {game.status === 'approved' ? '✅ Aprobada' :
                           game.status === 'rejected' ? '❌ Rechazada' :
                           '⏳ Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}