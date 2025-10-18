export type SpellResponse = {
  count: Number;
  results: Spell[];
};

export type Spell = {
  index?: string;
  name: string;
  level: number;
};

export type NameUrl = {
  name: string;
  url: string;
};

export type AreaOfEffect = {
  type: string;
  size: number;
};

export type SpellDC = {
  dc_type?: NameUrl;
  dc_success?: string;
  desc?: string;
};

export type SpellDamage = {
  damage_type?: NameUrl;
  damage_at_slot_level?: Record<string, string>;
  damage_at_character_level?: Record<string, string>;
};

export type SpellDetail = {
  index: string;
  name: string;
  level: number;

  desc: string[];
  higher_level?: string[];

  range: string;

  components: string[];
  material?: string;

  ritual: boolean;
  concentration: boolean;

  duration: string;
  casting_time: string;

  attack_type?: string;

  school: NameUrl;
  classes: NameUrl[];
  subclasses?: NameUrl[];

  area_of_effect?: AreaOfEffect;
  dc?: SpellDC;
  damage?: SpellDamage;
  heal_at_slot_level?: Record<string, string>;
};
