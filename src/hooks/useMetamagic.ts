import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import type { KnownMetamagicRow, MetamagicOption } from '../types/metamagic';
import { useAuthedMutation } from './useAuthedMutation';

export function useMetamagic() {
  const getMetamagic = useApi('getMetamagic');

  return useAuthedQuery<any, unknown, MetamagicOption[]>({
    queryKey: ['metamagic'],
    queryFn: () => getMetamagic(),
  });
}

export function useKnownMetamagic(characterId: string | undefined) {
  const getKnown = useApi('getKnownMetamagic');
  return useAuthedQuery<any, unknown, KnownMetamagicRow[]>({
    queryKey: ['metamagicKnown', characterId],
    enabled: !!characterId,
    queryFn: () => getKnown(characterId!),
  });
}

export function useAddKnownMetamagic(characterId: string | undefined) {
  const addKnown = useApi('addKnownMetamagic');
  return useAuthedMutation<KnownMetamagicRow, Error, { idx: string }>({
    mutationKey: ['metamagicKnown:add', characterId],
    mutationFn: ({ idx }) => {
      if (!characterId) throw new Error('Missing characterId');
      return addKnown(characterId, idx);
    },
    invalidateKeys: characterId ? [['metamagicKnown', characterId]] : [],
  });
}

export function useDeleteKnownMetamagic(characterId: string | undefined) {
  const delKnown = useApi('deleteKnownMetamagic');
  return useAuthedMutation<void, Error, { idx: string }>({
    mutationKey: ['metamagicKnown:delete', characterId],
    mutationFn: ({ idx }) => {
      if (!characterId) throw new Error('Missing characterId');
      return delKnown(characterId, idx);
    },
    invalidateKeys: characterId ? [['metamagicKnown', characterId]] : [],
  });
}

export function mergeKnownWithCatalog(
  catalog: MetamagicOption[] | undefined,
  known: KnownMetamagicRow[] | undefined
): {
  knownOptions: (MetamagicOption & { __idx: string })[];
  availableOptions: (MetamagicOption & { __idx: string })[];
} {
  const list = catalog ?? [];
  const byIdx = new Map(list.map((opt) => [opt.idx, opt]));
  const byId = new Map(list.map((opt) => [opt.id, opt]));

  const knownSlugSet = new Set<string>();
  for (const row of known ?? []) {
    if (row.idx && byIdx.has(row.idx)) {
      knownSlugSet.add(row.idx);
      continue;
    }
    if (row.option_id) {
      const opt = byId.get(row.option_id);
      if (opt) knownSlugSet.add(opt.idx);
    }
  }

  const withUiIdx = list.map((opt) => ({ ...opt, __idx: opt.idx }));

  const knownOptions = withUiIdx.filter((o) => knownSlugSet.has(o.__idx));
  const availableOptions = withUiIdx.filter((o) => !knownSlugSet.has(o.__idx));

  return { knownOptions, availableOptions };
}
