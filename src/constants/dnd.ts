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

export const SCHOOLS = [
  { index: 'abjuration', name: 'Abjuration' },
  { index: 'conjuration', name: 'Conjuration' },
  { index: 'divination', name: 'Divination' },
  { index: 'enchantment', name: 'Enchantment' },
  { index: 'evocation', name: 'Evocation' },
  { index: 'illusion', name: 'Illusion' },
  { index: 'necromancy', name: 'Necromancy' },
  { index: 'transmutation', name: 'Transmutation' },
  { index: 'chronurgy', name: 'Chronurgy' },
  { index: 'dunamancy', name: 'Dunamancy' },
] as const;

export const levelLabel = (lvl: number) =>
  lvl === 0 ? 'Cantrip' : `Level ${lvl}`;

export const preparedLevelLabel = [
  { index: 0, name: 'cantrip' },
  { index: 1, name: '1st' },
  { index: 2, name: '2nd' },
  { index: 3, name: '3rd' },
  { index: 4, name: '4th' },
  { index: 5, name: '5th' },
  { index: 6, name: '6th' },
  { index: 7, name: '7th' },
  { index: 8, name: '8th' },
  { index: 9, name: '9th' },
];
