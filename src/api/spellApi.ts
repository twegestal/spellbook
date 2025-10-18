import type { SpellDetail, SpellResponse } from '@/types/spells';
import ky from 'ky';

export const spellApi = (apiClient: typeof ky) => ({
  getAllSpells: async (): Promise<SpellResponse> =>
    await apiClient.get('spells').json(),

  getSpellByIndex: async (index: string): Promise<SpellDetail> =>
    apiClient.get(`spells/${index}`).json(),
});
