import { useMemo, useDeferredValue } from 'react';
import type { Spell } from '../types/spells';

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

export function useSpellSearch(
  data: { results?: Spell[] } | undefined,
  query: string
) {
  const sorted = useMemo<Spell[]>(() => {
    const list = (data?.results ?? []).slice();
    list.sort((a, b) => {
      const la = a.level ?? 0;
      const lb = b.level ?? 0;
      if (la !== lb) return la - lb;
      return collator.compare(a.name ?? '', b.name ?? '');
    });
    return list;
  }, [data]);

  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((s) => (s.name ?? '').toLowerCase().includes(q));
  }, [sorted, deferredQuery]);

  return { spells: filtered, sorted };
}
