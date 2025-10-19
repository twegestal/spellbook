import type { SpellListResponse } from '../types/spells';
import ky from 'ky';

export const spellApi = (apiClient: typeof ky) => ({
  getAllSpells: async (): Promise<SpellListResponse> =>
    await apiClient.get('spells').json(),
});
