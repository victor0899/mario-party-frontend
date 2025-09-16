import { useState } from 'react';
import { Button } from './ui/Button';
import { supabaseAPI } from '../services/supabase';
import type { Game } from '../types/api';

interface GameApprovalModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteSubmitted: () => void;
}

export default function GameApprovalModal({
  game,
  isOpen,
  onClose,
  onVoteSubmitted
}: GameApprovalModalProps) {
  const [isVoting, setIsVoting] = useState(false);

  if (!isOpen || !game) return null;

  const handleVote = async (vote: 'approve' | 'reject') => {
    setIsVoting(true);
    try {
      await supabaseAPI.voteOnGame({
        game_id: game.id,
        vote: vote
      });

      onVoteSubmitted();
      onClose();
    } catch (error: any) {
      console.error('Error al votar:', error);
      alert('Error al enviar el voto: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsVoting(false);
    }
  };

  // Sort results by position
  const sortedResults = game.results ?
    [...game.results].sort((a, b) => a.position - b.position) : [];

  // Count votes
  const approveVotes = game.approvals?.filter(a => a.vote === 'approve').length || 0;
  const rejectVotes = game.approvals?.filter(a => a.vote === 'reject').length || 0;
  const totalVotes = approveVotes + rejectVotes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Aprobar Partida</h2>
              <p className="text-gray-600">
                {game.map?.name} - {new Date(game.played_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              disabled={isVoting}
            >
              ×
            </button>
          </div>

          {/* Voting Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 mb-2">Estado de Votación:</div>
            <div className="flex space-x-4">
              <span className="text-green-600">✓ A favor: {approveVotes}</span>
              <span className="text-red-600">✗ En contra: {rejectVotes}</span>
              <span className="text-gray-500">Total: {totalVotes}</span>
            </div>
          </div>
        </div>

        {/* Game Results */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados de la Partida</h3>

          <div className="space-y-4">
            {sortedResults.map((result) => (
              <div key={result.player_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      result.position === 1 ? 'bg-yellow-500' :
                      result.position === 2 ? 'bg-gray-400' :
                      result.position === 3 ? 'bg-orange-600' :
                      'bg-red-500'
                    }`}>
                      {result.position}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {result.player?.is_cpu ? result.player.cpu_name : `Usuario ${result.player?.user_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {result.position === 1 ? '🥇 1er Lugar (4 puntos)' :
                         result.position === 2 ? '🥈 2do Lugar (3 puntos)' :
                         result.position === 3 ? '🥉 3er Lugar (2 puntos)' :
                         '4to Lugar (1 punto)'}
                      </p>
                    </div>
                  </div>

                  {/* Basic Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500">⭐ Estrellas</div>
                      <div className="font-bold">{result.stars}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">🪙 Monedas</div>
                      <div className="font-bold">{result.coins}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">🎮 Minijuegos</div>
                      <div className="font-bold">{result.minigames_won}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">⚔️ Showdown</div>
                      <div className="font-bold">{result.showdown_wins}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Actions */}
        <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-lg">
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isVoting}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => handleVote('reject')}
              disabled={isVoting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isVoting ? 'Votando...' : '✗ Rechazar'}
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={() => handleVote('approve')}
              disabled={isVoting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isVoting ? 'Votando...' : '✓ Aprobar'}
            </Button>
          </div>

          <div className="mt-3 text-center text-sm text-gray-500">
            Se necesita mayoría de votos para aprobar o rechazar la partida
          </div>
        </div>
      </div>
    </div>
  );
}