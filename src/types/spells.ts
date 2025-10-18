export type SpellResponse = {
  count: Number;
  results: Spell[];
};

export type Spell = {
  index?: string;
  name: string;
  level: number;
};

export type SpellDetail = {
  index: string;
  name: string;
  level: number;
  school?: { name?: string } | string;
  desc?: string[];
  higher_level?: string[];
  material?: string;
  components?: string[];
  ritual?: boolean;
  concentration?: boolean;
  casting_time?: string;
  range?: string;
  duration?: string;
  classes?: { name: string }[];
  subclasses?: { name: string }[];
  damage?: unknown;
  [key: string]: unknown;
};
