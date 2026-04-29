import type { SpellListResponse } from '../types/spells';
import type { Character, CharacterListResponse } from '../types/character';
import ky from 'ky';

export const characterApi = (api: typeof ky) => ({
  listCharacters: () => api.get('characters').json<CharacterListResponse>(),

  createCharacter: (body: {
    name: string;
    race: string;
    class: string;
    level: number;
  }) => api.post('characters', { json: body }).json<Character>(),

  getKnownSpells: (characterId: string) =>
    api.get(`characters/${characterId}/known-spells`).json<SpellListResponse>(),

  addKnownSpell: (body: { characterId: string; spellId: string }) =>
    api
      .post(`characters/${body.characterId}/known-spells`, {
        json: { spellId: body.spellId },
      })
      .json<{ character_id: string; spell_id: string; added_at: string }>(),

  removeKnownSpell: (characterId: string, spellId: string) =>
    api
      .delete(`characters/${characterId}/known-spells/${spellId}`)
      .json<{ ok: true }>(),

  getPreparedSpells: (characterId: string) =>
    api
      .get(`characters/${characterId}/prepared-spells`)
      .json<SpellListResponse>(),

  addPreparedSpell: (body: { characterId: string; spellId: string }) =>
    api
      .post(`characters/${body.characterId}/prepared-spells`, {
        json: { spellId: body.spellId },
      })
      .json<{ character_id: string; spell_id: string; prepared_at: string }>(),

  removePreparedSpell: (characterId: string, spellId: string) =>
    api
      .delete(`characters/${characterId}/prepared-spells/${spellId}`)
      .json<{ ok: true }>(),

  updateCharacterLevel: (characterId: string, level: number) =>
    api
      .patch(`characters/${characterId}/level`, { json: { level } })
      .json<Character>(),

  addCharacterClass: (
    characterId: string,
    body: { class: string; level: number },
  ) =>
    api
      .post(`characters/${characterId}/classes`, { json: body })
      .json<Character>(),

  updateCharacterClassLevel: (
    characterId: string,
    classId: number,
    level: number,
  ) =>
    api
      .patch(`characters/${characterId}/classes/${classId}`, {
        json: { level },
      })
      .json<Character>(),

  removeCharacterClass: (characterId: string, classId: number) =>
    api
      .delete(`characters/${characterId}/classes/${classId}`)
      .json<Character>(),

  listAllCharacters: () =>
    api.get('characters/all').json<CharacterListResponse>(),

  retireCharacter: (characterId: string) =>
    api.patch(`characters/${characterId}/retire`).json<Character>(),
  restoreCharacter: (characterId: string) =>
    api.patch(`characters/${characterId}/restore`).json<Character>(),
});
