import ky from 'ky';
import type { KnownMetamagicRow, MetamagicOption } from '../types/metamagic';

export const metamagicApi = (apiClient: typeof ky) => ({
  getMetamagic: () => apiClient.get('metamagic').json<MetamagicOption[]>(),
  getKnownMetamagic: (characterId: string) =>
    apiClient
      .get(`characters/${characterId}/metamagic-known`)
      .json<KnownMetamagicRow[]>(),

  addKnownMetamagic: (characterId: string, idx: string) =>
    apiClient
      .post(`characters/${characterId}/metamagic-known`, {
        json: { optionIdx: idx },
      })
      .json<KnownMetamagicRow>(),

  deleteKnownMetamagic: (characterId: string, idx: string) =>
    apiClient
      .delete(`characters/${characterId}/metamagic-known/${idx}`)
      .json<void>(),
});
