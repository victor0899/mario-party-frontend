/**
 * Utility functions for map images and game boards
 */

export const getMapImageUrl = (mapName: string): string | null => {
  const availableImages: { [key: string]: string } = {
    'Goomba Lagoon': 'GoombaLagoon.webp',
    'King Bowser\'s Keep': 'SMPJ_King_Bowser\'s_Keep.webp',
    'Mario\'s Rainbow Castle': 'SMPJ_Mario\'s_Rainbow_Castle.webp',
    'Mega Wiggler\'s Tree Party': 'SMPJ_Mega_Wiggler\'s_Tree_Party.webp',
    'Rainbow Galleria': 'SMPJ_Rainbow_Galleria.webp',
    'Roll \'em Raceway': 'SMPJ_Roll_\'em_Raceway.webp',
    'Western Land': 'SMPJ_Western_Land.webp'
  };

  const filename = availableImages[mapName];
  return filename ? `/images/maps/${filename}` : null;
};