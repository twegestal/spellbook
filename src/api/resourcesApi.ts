import ky from 'ky';
import type { CharacterResource } from '../types/resources';

export const resourcesApi = (apiClient: typeof ky) => ({
  getResources: (characterId: string): Promise<CharacterResource[]> =>
    apiClient.get(`characters/${characterId}/resources`).json(),

  setResource: (
    characterId: string,
    key: string,
    maximum: number,
    resets_on: 'long' | 'short' = 'long',
  ): Promise<CharacterResource> =>
    apiClient
      .put(`characters/${characterId}/resources/${key}`, {
        json: { maximum, resets_on },
      })
      .json(),

  spendResource: (
    characterId: string,
    key: string,
    qty: number = 1,
  ): Promise<CharacterResource> =>
    apiClient
      .post(`characters/${characterId}/resources/${key}/spend`, {
        json: { qty },
      })
      .json(),

  restoreResource: (
    characterId: string,
    key: string,
    qty?: number,
  ): Promise<CharacterResource> =>
    apiClient
      .post(`characters/${characterId}/resources/${key}/restore`, {
        json: qty != null ? { qty } : {},
      })
      .json(),
});
