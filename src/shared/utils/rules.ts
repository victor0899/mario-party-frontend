import type { RuleSet } from '../types/api';

interface PositionPoints {
  position: number;
  points: number;
  emoji: string;
  label: string;
}

interface RuleSetInfo {
  name: string;
  description: string;
  positions: PositionPoints[];
  bonuses?: {
    name: string;
    points: number;
    timing: 'per_game' | 'end_of_league';
    description: string;
  }[];
}

export const RULE_SETS: Record<RuleSet, RuleSetInfo> = {
  classic: {
    name: 'Clásico',
    description: 'Sistema tradicional donde todos suman puntos',
    positions: [
      { position: 1, points: 4, emoji: '🥇', label: '1er Lugar' },
      { position: 2, points: 3, emoji: '🥈', label: '2do Lugar' },
      { position: 3, points: 2, emoji: '🥉', label: '3er Lugar' },
      { position: 4, points: 1, emoji: '', label: '4to Lugar' },
    ],
  },
  pro_bonus: {
    name: 'ProBonus',
    description: 'Sistema competitivo con bonos especiales',
    positions: [
      { position: 1, points: 3, emoji: '🥇', label: '1er Lugar' },
      { position: 2, points: 2, emoji: '🥈', label: '2do Lugar' },
      { position: 3, points: 1, emoji: '🥉', label: '3er Lugar' },
      { position: 4, points: 0, emoji: '', label: '4to Lugar' },
    ],
    bonuses: [
      {
        name: 'Rey de Minijuegos',
        points: 1,
        timing: 'per_game',
        description: 'Sumado en cada partida al jugador con más minijuegos ganados',
      },
      {
        name: 'Rey de Estrellas',
        points: 1,
        timing: 'end_of_league',
        description: 'Sumado al final de la liga al jugador con más estrellas ganadas',
      },
      {
        name: 'Rey de Monedas',
        points: 1,
        timing: 'end_of_league',
        description: 'Sumado al final de la liga al jugador con más monedas ganadas',
      },
      {
        name: 'Rey de Victorias',
        points: 3,
        timing: 'end_of_league',
        description: 'Sumado al final de la liga al jugador con más victorias',
      },
    ],
  },
};

export const getRuleSetInfo = (ruleSet: RuleSet): RuleSetInfo => {
  return RULE_SETS[ruleSet];
};

export const getPositionPoints = (ruleSet: RuleSet, position: number): number => {
  const ruleInfo = RULE_SETS[ruleSet];
  const positionInfo = ruleInfo.positions.find(p => p.position === position);
  return positionInfo?.points ?? 0;
};

export const formatPositionText = (ruleSet: RuleSet): string => {
  const ruleInfo = RULE_SETS[ruleSet];
  return ruleInfo.positions
    .map(p => `${p.emoji} ${p.label}: ${p.points} punto${p.points !== 1 ? 's' : ''}`)
    .join(' • ');
};

export const formatBonusText = (ruleSet: RuleSet): string | null => {
  const ruleInfo = RULE_SETS[ruleSet];
  if (!ruleInfo.bonuses) return null;

  return ruleInfo.bonuses
    .map(b => `${b.name} (+${b.points}pt${b.timing === 'per_game' ? ' cada partida' : ' al final'})`)
    .join(' • ');
};
