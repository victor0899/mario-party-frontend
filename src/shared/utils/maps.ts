/**
 * Utility functions for map images and game boards
 */

interface MapInfo {
  description: string;
  difficulty: number; // 1-5 stars
}

const mapDetails: { [key: string]: MapInfo } = {
  'Mega Wiggler\'s Tree Party': {
    description: 'The forest that Mega Wiggler calls home. Everyone\'s making treats!',
    difficulty: 1
  },
  'Roll \'em Raceway': {
    description: 'A high-speed track where you can race and win!',
    difficulty: 3
  },
  'Rainbow Galleria': {
    description: 'A three story shopping mall crammed with stores to visit!',
    difficulty: 4
  },
  'Goomba Lagoon': {
    description: 'A large island with a Goomba-shaped volcano. Watch out for the tide!',
    difficulty: 4
  },
  'Western Land': {
    description: 'A nostalgic old-west town. Be careful around the tracks!',
    difficulty: 2
  },
  'Mario\'s Rainbow Castle': {
    description: 'A castle above the clouds. Care to pay a visit to the Toad at its top?',
    difficulty: 1
  },
  'King Bowser\'s Keep': {
    description: 'Impostor Bowser\'s secret base! Watch out for attacks!',
    difficulty: 5
  }
};

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

export const getMapInfo = (mapName: string): MapInfo | null => {
  return mapDetails[mapName] || null;
};

export const renderDifficultyStars = (difficulty: number): string => {
  const filledStars = '★'.repeat(difficulty);
  const emptyStars = '☆'.repeat(5 - difficulty);
  return filledStars + emptyStars;
};