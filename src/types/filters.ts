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

export const getSavingThrow = (spell: any): Ability | undefined => {
  const ix = spell?.dc?.dc_type?.index as string | undefined;
  if (!ix) return undefined;
  return ix.toUpperCase() as Ability;
};

export const spellHasAnyClass = (spell: any, classIdxes: string[]) => {
  if (!classIdxes.length) return true;
  const inSpell: string[] = (spell.classes ?? []).map((c: any) => c.index);
  return classIdxes.some((c) => inSpell.includes(c));
};

export const triMatch = (tri: TriBool, value: boolean | undefined) => {
  if (tri === 'any') return true;
  if (tri === 'yes') return !!value;
  return !value;
};

export const spellMatchesSchool = (spell: any, schoolIdxes: string[]) => {
  if (!schoolIdxes.length) return true;
  const ix = spell?.school?.index as string | undefined;
  if (!ix) return false;
  return schoolIdxes.includes(ix);
};
