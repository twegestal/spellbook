import ky from 'ky';
import { spellApi } from './spellApi';
import { characterApi } from './characterApi';

export const api = (apiClient: typeof ky) =>
  Object.freeze({
    ...spellApi(apiClient),
    ...characterApi(apiClient),
  });
