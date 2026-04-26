import type {
  SpellListResponse,
  Spell,
  CreateSpell,
  UpdateSpell,
} from '../types/spells';
import ky from 'ky';

export const spellApi = (apiClient: typeof ky) => ({
  getAllSpells: async (): Promise<SpellListResponse> =>
    await apiClient.get('spells').json(),

  getHomebrewSpells: async (): Promise<SpellListResponse> =>
    await apiClient.get('spells/homebrew').json(),

  createHomebrewSpell: async (input: CreateSpell): Promise<Spell> =>
    await apiClient.post('spells/homebrew', { json: input }).json(),

  updateHomebrewSpell: async (id: string, input: UpdateSpell): Promise<Spell> =>
    await apiClient.patch(`spells/homebrew/${id}`, { json: input }).json(),

  togglePublishSpell: async (id: string): Promise<Spell> =>
    await apiClient.patch(`spells/homebrew/${id}/publish`).json(), 

  deleteHomebrewSpell: async (id: string): Promise<void> =>
    await apiClient.delete(`spells/homebrew/${id}`).json(),
});
