import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import type { MetamagicOption } from '../types/metamagic';

export function useMetamagic() {
  const getMetamagic = useApi('getMetamagic');

  return useAuthedQuery<any, unknown, MetamagicOption[]>({
    queryKey: ['metamagic'],
    queryFn: () => getMetamagic(),
  });
}
