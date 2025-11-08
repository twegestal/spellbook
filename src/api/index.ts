import ky from 'ky';
import { spellApi } from './spellApi';
import { characterApi } from './characterApi';
import { metaApi } from './metaApi';
import { slotsApi } from './slotApi';
import { metamagicApi } from './metamagicApi';
import { sorceryPointsApi } from './sorceryPointsApi';

export const api = (apiClient: typeof ky) =>
  Object.freeze({
    ...spellApi(apiClient),
    ...characterApi(apiClient),
    ...metaApi(apiClient),
    ...slotsApi(apiClient),
    ...metamagicApi(apiClient),
    ...sorceryPointsApi(apiClient),
  });
