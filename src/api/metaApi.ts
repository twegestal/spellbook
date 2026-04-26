import ky from 'ky';
import type { MetaResponse } from '../types/meta';

export const metaApi = (api: typeof ky) => ({
  getRaces: (): Promise<MetaResponse> => api.get('meta/races').json(),
  getClasses: (): Promise<MetaResponse> => api.get('meta/classes').json(),
  getSchools: (): Promise<MetaResponse> => api.get('meta/schools').json(),
  getDamageTypes: (): Promise<MetaResponse> =>
    api.get('meta/damage-types').json(),
  getSpellClasses: (): Promise<MetaResponse> =>
    api.get('meta/spell-classes').json(),
});
