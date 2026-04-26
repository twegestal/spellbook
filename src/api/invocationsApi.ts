import ky from 'ky';
import type {
  InvocationOption,
  KnownInvocationRow,
} from '../types/invocations';

export const invocationsApi = (apiClient: typeof ky) => ({
  getInvocations: (): Promise<InvocationOption[]> =>
    apiClient.get('invocations').json(),

  getKnownInvocations: (characterId: string): Promise<KnownInvocationRow[]> =>
    apiClient.get(`characters/${characterId}/invocations-known`).json(),

  addKnownInvocation: (
    characterId: string,
    optionIdx: string,
  ): Promise<KnownInvocationRow> =>
    apiClient
      .post(`characters/${characterId}/invocations-known`, {
        json: { optionIdx },
      })
      .json(),

  deleteKnownInvocation: (
    characterId: string,
    optionIdx: string,
  ): Promise<void> =>
    apiClient
      .delete(`characters/${characterId}/invocations-known/${optionIdx}`)
      .json(),
});
