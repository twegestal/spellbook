import { useMemo, useDeferredValue } from 'react';
import Fuse from 'fuse.js';
import type { Spell } from '../types/spells';

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

export function useSpellSearch(
  data: { results?: Spell[] } | undefined,
  query: string
) {
  const base = data?.results ?? [];

  const sorted = useMemo<Spell[]>(() => {
    const list = base.slice();
    list.sort((a, b) => {
      const la = a.level ?? 0;
      const lb = b.level ?? 0;
      if (la !== lb) return la - lb;
      return collator.compare(a.name ?? '', b.name ?? '');
    });
    return list;
  }, [base]);

  const fuse = useMemo(
    () =>
      new Fuse(base, {
        keys: ['name'],
        includeScore: false,
        ignoreLocation: true,
        threshold: 0.35,
        minMatchCharLength: 2,
        shouldSort: false,
        useExtendedSearch: false,
      }),
    [base]
  );

  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return sorted;
    const items = fuse.search(q).map((r) => r.item);
    items.sort((a, b) => {
      const la = a.level ?? 0;
      const lb = b.level ?? 0;
      if (la !== lb) return la - lb;
      return collator.compare(a.name ?? '', b.name ?? '');
    });
    return items;
  }, [sorted, fuse, deferredQuery]);

  return { spells: filtered, sorted };
}
