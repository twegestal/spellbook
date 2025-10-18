export type SpellResponse = {
  count: Number;
  results: Spell[];
};

export type Spell = {
  index?: string;
  name: string;
  level: number;
};
