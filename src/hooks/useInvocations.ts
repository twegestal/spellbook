import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import { useAuthedMutation } from './useAuthedMutation';
import type {
  InvocationOption,
  KnownInvocationRow,
} from '../types/invocations';

export function useInvocations() {
  const getInvocations = useApi('getInvocations');
  return useAuthedQuery<any, unknown, InvocationOption[]>({
    queryKey: ['invocations'],
    queryFn: () => getInvocations(),
  });
}

export function useKnownInvocations(characterId: string | undefined) {
  const getKnown = useApi('getKnownInvocations');
  return useAuthedQuery<any, unknown, KnownInvocationRow[]>({
    queryKey: ['invocationsKnown', characterId],
    enabled: !!characterId,
    queryFn: () => getKnown(characterId!),
  });
}

export function useAddKnownInvocation(characterId: string | undefined) {
  const addKnown = useApi('addKnownInvocation');
  return useAuthedMutation<KnownInvocationRow, Error, { idx: string }>({
    mutationKey: ['invocationsKnown:add', characterId],
    mutationFn: ({ idx }) => {
      if (!characterId) throw new Error('Missing characterId');
      return addKnown(characterId, idx);
    },
    invalidateKeys: characterId ? [['invocationsKnown', characterId]] : [],
  });
}

export function useDeleteKnownInvocation(characterId: string | undefined) {
  const delKnown = useApi('deleteKnownInvocation');
  return useAuthedMutation<void, Error, { idx: string }>({
    mutationKey: ['invocationsKnown:delete', characterId],
    mutationFn: ({ idx }) => {
      if (!characterId) throw new Error('Missing characterId');
      return delKnown(characterId, idx);
    },
    invalidateKeys: characterId ? [['invocationsKnown', characterId]] : [],
  });
}

export function mergeKnownWithInvocationCatalog(
  catalog: InvocationOption[] | undefined,
  known: KnownInvocationRow[] | undefined,
): {
  knownOptions: (InvocationOption & { __idx: string })[];
  availableOptions: (InvocationOption & { __idx: string })[];
} {
  const list = catalog ?? [];
  const byIdx = new Map(list.map((opt) => [opt.idx, opt]));
  const byId = new Map(list.map((opt) => [opt.id, opt]));

  const knownIdxSet = new Set<string>();
  for (const row of known ?? []) {
    if (row.invocation_idx && byIdx.has(row.invocation_idx)) {
      knownIdxSet.add(row.invocation_idx);
      continue;
    }
    if (row.invocation_id) {
      const opt = byId.get(row.invocation_id);
      if (opt) knownIdxSet.add(opt.idx);
    }
  }

  const withUiIdx = list.map((opt) => ({ ...opt, __idx: opt.idx }));
  const knownOptions = withUiIdx.filter((o) => knownIdxSet.has(o.__idx));
  const availableOptions = withUiIdx.filter((o) => !knownIdxSet.has(o.__idx));

  return { knownOptions, availableOptions };
}
