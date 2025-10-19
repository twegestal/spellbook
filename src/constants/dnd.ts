export const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

export const CLASSES = [
  { index: 'barbarian', name: 'Barbarian' },
  { index: 'bard', name: 'Bard' },
  { index: 'cleric', name: 'Cleric' },
  { index: 'druid', name: 'Druid' },
  { index: 'fighter', name: 'Fighter' },
  { index: 'monk', name: 'Monk' },
  { index: 'paladin', name: 'Paladin' },
  { index: 'ranger', name: 'Ranger' },
  { index: 'rogue', name: 'Rogue' },
  { index: 'sorcerer', name: 'Sorcerer' },
  { index: 'warlock', name: 'Warlock' },
  { index: 'wizard', name: 'Wizard' },
] as const;

export const levelLabel = (lvl: number) =>
  lvl === 0 ? 'Cantrip' : `Level ${lvl}`;
