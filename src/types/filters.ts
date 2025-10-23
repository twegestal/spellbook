import type { Spell } from './spells';

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
export type TriBool = 'any' | 'yes' | 'no';

export type SpellFilters = {
  levels: number[];
  classes: string[];
  savingThrows: Ability[];
  ritual: TriBool;
  concentration: TriBool;
  schools: string[];
};

export const emptyFilters: SpellFilters = {
  levels: [],
  classes: [],
  savingThrows: [],
  ritual: 'any',
  concentration: 'any',
  schools: [],
};

export const getSavingThrow = (spell: Spell): Ability | undefined => {
  const ix = spell?.dc_type as string | undefined;
  return ix ? (ix.toUpperCase() as Ability) : undefined;
};

export const spellHasAnyClass = (spell: any, selectedClassNames: string[]) => {
  if (!selectedClassNames.length) return true;

  const wanted = new Set(selectedClassNames.map((s) => s.trim().toLowerCase()));

  let have: string[] = Array.isArray(spell.class_names)
    ? spell.class_names
    : [];
  if (Array.isArray(spell.class_idxs)) {
    have = have.concat(spell.class_idxs);
  }

  const haveNorm = have.map((s) => String(s).trim().toLowerCase());
  return haveNorm.some((h) => wanted.has(h));
};

export const triMatch = (tri: TriBool, value: boolean | undefined) => {
  if (tri === 'any') return true;
  if (tri === 'yes') return !!value;
  return !value;
};

export const spellMatchesSchool = (
  spell: any,
  selectedSchoolIdxes: string[]
) => {
  if (!selectedSchoolIdxes.length) return true;
  const ix = spell?.school_idx as string | undefined;
  if (!ix) return false;
  return selectedSchoolIdxes.includes(ix);
};
