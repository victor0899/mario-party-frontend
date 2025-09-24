import { useState } from 'react';
import { Button } from './ui/Button';

interface AddCPUModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, avatar: string) => void;
  isLoading?: boolean;
}

export default function AddCPUModal({ isOpen, onClose, onAdd, isLoading = false }: AddCPUModalProps) {
  const [cpuName, setCpuName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('mario');

  // Function to get character image from character ID
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

  // Get available characters for CPU selection
  const getAvailableCharacters = () => {
    return [
      { id: 'mario', name: 'Mario' },
      { id: 'luigi', name: 'Luigi' },
      { id: 'peach', name: 'Peach' },
      { id: 'bowser', name: 'Bowser' },
      { id: 'yoshi', name: 'Yoshi' },
      { id: 'toad', name: 'Toad' },
      { id: 'wario', name: 'Wario' },
      { id: 'waluigi', name: 'Waluigi' },
      { id: 'rosalina', name: 'Rosalina' },
      { id: 'bowser-jr', name: 'Bowser Jr.' },
      { id: 'toadette', name: 'Toadette' },
      { id: 'daisy', name: 'Daisy' },
      { id: 'shy-guy', name: 'Shy Guy' },
      { id: 'koopa', name: 'Koopa' },
      { id: 'goomba', name: 'Goomba' },
      { id: 'boo', name: 'Boo' },
      { id: 'dk', name: 'Donkey Kong' },
      { id: 'birdo', name: 'Birdo' },
      { id: 'pauline', name: 'Pauline' },
      { id: 'ninji', name: 'Ninji' },
      { id: 'spike', name: 'Spike' },
      { id: 'monty-mole', name: 'Monty Mole' }
    ];
  };

  const handleSubmit = () => {
    if (cpuName.trim()) {
      onAdd(cpuName.trim(), selectedAvatar);
      setCpuName('');
      setSelectedAvatar('mario');
    }
  };

  const handleClose = () => {
    setCpuName('');
    setSelectedAvatar('mario');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Agregar CPU</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* CPU Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del CPU
            </label>
            <input
              type="text"
              value={cpuName}
              onChange={(e) => setCpuName(e.target.value)}
              placeholder="Ej: Mario CPU, Luigi Bot, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar Personaje
            </label>
            <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {getAvailableCharacters().map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedAvatar(character.id)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedAvatar === character.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={character.name}
                >
                  <div className="aspect-square">
                    <img
                      src={getCharacterImage(character.id)}
                      alt={character.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className={`text-xs font-medium mt-1 truncate ${
                    selectedAvatar === character.id ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {character.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Character Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Vista previa:</div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-500 flex items-center justify-center">
                <img
                  src={getCharacterImage(selectedAvatar)}
                  alt="Avatar seleccionado"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {cpuName || 'Nombre del CPU'}
                </div>
                <div className="text-sm text-purple-600">CPU Player</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!cpuName.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Agregando...' : 'Agregar CPU'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}