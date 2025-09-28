/**
 * Utility functions for character images and avatars
 */

export const getCharacterImage = (characterId: string): string => {
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