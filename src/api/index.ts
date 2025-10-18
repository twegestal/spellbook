import ky from 'ky';
import { spellApi } from './spellApi';
import { characterApi } from './characterApi';
import { metaApi } from './metaApi';

export const api = (apiClient: typeof ky) =>
  Object.freeze({
    ...spellApi(apiClient),
    ...characterApi(apiClient),
    ...metaApi(apiClient),
  });
