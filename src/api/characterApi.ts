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
});
