import ky from 'ky';
import type { MetaResponse } from '../types/meta';

export const metaApi = (api: typeof ky) => ({
  getRaces: (): Promise<MetaResponse> => api.get('meta/races').json(),
  getClasses: (): Promise<MetaResponse> => api.get('meta/classes').json(),
});
