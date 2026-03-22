import ky from 'ky';
import type { SorceryPoints } from '../types/sorceryPoints';

export const sorceryPointsApi = (apiClient: typeof ky) => ({
  getSorceryPoints: (characterId: string) =>
    apiClient
      .get(`characters/${characterId}/sorcery-points`)
      .json<SorceryPoints>(),

  spendSorceryPoints: (characterId: string, body: { qty: number }) =>
    apiClient
      .post(`characters/${characterId}/sorcery-points/spend`, { json: body })
      .json<{ ok: boolean }>(),

  recoverSorceryPoints: (characterId: string, body: { qty: number }) =>
    apiClient
      .post(`characters/${characterId}/sorcery-points/restore`, { json: body })
      .json<{ ok: boolean }>(),
});
