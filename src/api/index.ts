import ky from 'ky';
import { spellApi } from './spellApi';

export const api = (apiClient: typeof ky) =>
  Object.freeze({
    ...spellApi(apiClient),
  });
