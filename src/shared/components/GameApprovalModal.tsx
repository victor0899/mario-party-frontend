import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { supabaseAPI } from '../services/supabase';
import { formatGameDate } from '../utils/dateFormat';
import type { Game } from '../types/api';

const getCharacterImage = (characterId: string) => {
  const characterMap: { [key: string]: string } = {
    'mario': '/images/characters/SMP_Icon_Mario.webp',
    'luigi': '/images/characters/SMP_Icon_Luigi.webp',
    'peach': '/images/characters/SMP_Icon_Peach.webp',
    'bowser': '/images/characters/SMP_Icon_Bowser.webp',
    'yoshi': '/images/characters/SMPJ_Icon_Yoshi.webp',
    'toad': '/images/characters/SMPJ_Icon_Toad.webp',
    'wario': '/images/characters/SMP_Icon_Wario.webp',
    'waluigi': '/images/characters/SMP_Icon_Waluigi.webp',
    'rosalina': '/images/characters/SMP_Icon_Rosalina.webp',
    'bowser-jr': '/images/characters/SMP_Icon_Jr.webp',
    'toadette': '/images/characters/SMPJ_Icon_Toadette.webp',
    'daisy': '/images/characters/MPS_Daisy_icon.webp',
    'shy-guy': '/images/characters/SMP_Icon_Shy_Guy.webp',
    'koopa': '/images/characters/SMP_Icon_Koopa.webp',
    'goomba': '/images/characters/SMP_Icon_Goomba.webp',
    'boo': '/images/characters/SMP_Icon_Boo.webp',
    'dk': '/images/characters/SMP_Icon_DK.webp',
    'birdo': '/images/characters/MPS_Birdo_icon.webp',
    'pauline': '/images/characters/SMPJ_Icon_Pauline.webp',
    'ninji': '/images/characters/SMPJ_Icon_Ninji.webp',
    'spike': '/images/characters/SMPJ_Icon_Spike.webp',
    'monty-mole': '/images/characters/SMP_Icon_Monty_Mole.webp'
  };

  return characterMap[characterId] || '/images/characters/SMP_Icon_Mario.webp';
};

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
      toast.error('Error al enviar el voto: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsVoting(false);
    }
  };

  const sortedResults = game.results ?
    [...game.results].sort((a, b) => a.position - b.position) : [];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Aprobar Partida</h2>
              <p className="text-gray-600">
                {game.map?.name} - {formatGameDate(game.played_at)}
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

        </div>

        <div className="p-6">
          <h3 className="text-xl font-mario text-gray-800 mb-4">Resultados de la Partida</h3>

          <div className="space-y-4">
            {sortedResults.map((result) => (
              <div key={result.player_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full p-0.5 ${
                        result.position === 1 ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600' :
                        result.position === 2 ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500' :
                        result.position === 3 ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700' :
                        'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
                      }`}>
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                          {result.player?.is_cpu ? (
                            result.player.cpu_avatar ? (
                              <img
                                src={getCharacterImage(result.player.cpu_avatar)}
                                alt={result.player.cpu_name || 'CPU'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">🤖</span>
                            )
                          ) : result.player?.profile?.profile_picture ? (
                            <img
                              src={getCharacterImage(result.player.profile.profile_picture)}
                              alt={result.player?.profile?.nickname || 'Usuario'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 text-sm">👤</span>
                          )}
                        </div>
                      </div>

                      {/* Position indicator */}
                      <div className={`absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white ${
                        result.position === 1 ? 'bg-yellow-600' :
                        result.position === 2 ? 'bg-gray-500' :
                        result.position === 3 ? 'bg-orange-700' :
                        'bg-gray-600'
                      }`}>
                        {result.position}
                      </div>

                      {/* Vote status indicator */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white ${
                        result.player?.is_cpu
                          ? 'bg-purple-500'
                          : (() => {
                              const userVote = game.approvals?.find(approval => approval.voter_id === result.player_id);
                              if (!userVote) return 'bg-gray-400';
                              return userVote.vote === 'approve' ? 'bg-green-500' : 'bg-red-500';
                            })()
                      }`}>
                        {result.player?.is_cpu
                          ? '🤖'
                          : (() => {
                              const userVote = game.approvals?.find(approval => approval.voter_id === result.player_id);
                              if (!userVote) return '−';
                              return userVote.vote === 'approve' ? '✓' : '✗';
                            })()
                        }
                      </div>
                    </div>

                    <div className="pr-16 ml-4">
                      <p className="font-semibold mb-2 text-left">
                        {result.player?.is_cpu
                          ? result.player.cpu_name
                          : (result.player?.profile?.nickname || 'Usuario sin nombre')
                        }
                      </p>
                      <p className="text-sm text-gray-500 text-left">
                        {result.position === 1 ? '4 puntos' :
                         result.position === 2 ? '3 puntos' :
                         result.position === 3 ? '2 puntos' :
                         '1 punto'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                        <img src="/images/others/MPS_Star.webp" alt="Estrella" className="w-4 h-4" />
                        <span>Estrellas</span>
                      </div>
                      <div className="font-bold">{result.stars}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                        <img src="/images/others/NSMBDS_Coin_Artwork.webp" alt="Moneda" className="w-4 h-4" />
                        <span>Monedas</span>
                      </div>
                      <div className="font-bold">{result.coins}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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