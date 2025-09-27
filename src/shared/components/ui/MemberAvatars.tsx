import { useState } from 'react';
import type { GroupMember } from '../../types/api';

interface MemberAvatarsProps {
  members: GroupMember[];
  maxDisplay?: number;
  size?: 'sm' | 'md';
}

export default function MemberAvatars({ members, maxDisplay = 4, size = 'sm' }: MemberAvatarsProps) {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

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

  const displayMembers = members.slice(0, maxDisplay);
  const remainingCount = Math.max(0, members.length - maxDisplay);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8'
  };

  const overllapClasses = {
    sm: '-ml-1',
    md: '-ml-2'
  };

  return (
    <div className="relative flex items-center">
      {displayMembers.map((member, index) => (
        <div
          key={member.id}
          className={`relative ${index > 0 ? overllapClasses[size] : ''}`}
          onMouseEnter={() => setHoveredMember(member.id)}
          onMouseLeave={() => setHoveredMember(null)}
        >
          <div className={`${sizeClasses[size]} rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer ${
            member.is_cpu ? 'ring-1 ring-purple-300' : 'ring-1 ring-blue-300'
          }`}>
            {member.is_cpu ? (
              member.cpu_avatar ? (
                <img
                  src={getCharacterImage(member.cpu_avatar)}
                  alt={member.cpu_name || 'CPU'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white text-xs">
                  🤖
                </div>
              )
            ) : (
              member.profile?.profile_picture ? (
                <img
                  src={getCharacterImage(member.profile.profile_picture)}
                  alt={member.profile.nickname || 'Usuario'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {(member.profile?.nickname || 'U')[0].toUpperCase()}
                </div>
              )
            )}
          </div>

          {/* Tooltip */}
          {hoveredMember === member.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
              <div className="flex items-center space-x-1">
                {member.is_cpu ? (
                  <>
                    <span>{member.cpu_name}</span>
                    <span className="text-purple-300 text-[10px] opacity-75">CPU</span>
                  </>
                ) : (
                  <span>{member.profile?.nickname || 'Usuario sin nombre'}</span>
                )}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div className={`${sizeClasses[size]} ${overllapClasses[size]} rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}