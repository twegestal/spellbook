import ky from 'ky';
import type { MetamagicOption } from '../types/metamagic';

export const metamagicApi = (apiClient: typeof ky) => ({
  getMetamagic: () => apiClient.get('metamagic').json<MetamagicOption[]>(),
});
