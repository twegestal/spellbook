// src/pages/SpellsPage.tsx
import { type FC, useMemo, useRef, useState, useCallback } from 'react';
import { Box, Stack } from '@chakra-ui/react';

import { SpellFiltersDrawer } from '../components/SpellFiltersDrawer';
import { useSpells } from '../hooks/useSpell';
import { useSpellSearch } from '../hooks/useSpellSearch';
import { SpellsTopBar } from '../components/layout/SpellsTopBar';
import { SpellList } from '../components/spell/SpellList';
import { LoadingSpinner } from '../components/overlays/LoadingSpinner';
import { openSpellDialog } from '../components/overlays/openSpellDialog';
import { spellDialog } from '../components/overlays/SpellDialog';

import {
  emptyFilters,
  getSavingThrow,
  spellHasAnyClass,
  triMatch,
  type SpellFilters,
} from '../types/filters';

export const SpellsPage: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);

  const shellRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useSpells();
  const { spells: queryFiltered } = useSpellSearch(data, query);

  const filterSpell = useCallback((s: any, f: SpellFilters) => {
    if (f.levels.length && !f.levels.includes(s.level)) return false;
    if (!spellHasAnyClass(s, f.classes)) return false;

    const st = getSavingThrow(s);
    if (f.savingThrows.length && (!st || !f.savingThrows.includes(st)))
      return false;

    if (!triMatch(f.ritual, s.ritual)) return false;
    if (!triMatch(f.concentration, s.concentration)) return false;

    return true;
  }, []);

  const applyFilters = useCallback(
    (arr: any[], f: SpellFilters) => arr.filter((s) => filterSpell(s, f)),
    [filterSpell]
  );

  const filteredSpells = useMemo(
    () => applyFilters(queryFiltered ?? [], filters),
    [applyFilters, queryFiltered, filters]
  );

  const computeMatchingCount = useCallback(
    (f: SpellFilters) => applyFilters(queryFiltered ?? [], f).length,
    [applyFilters, queryFiltered]
  );

  return (
    <Stack ref={shellRef} minH="100dvh" gap={0}>
      {isLoading ? (
        <Box flex="1" display="grid" placeItems="center" p={4}>
          <LoadingSpinner />
        </Box>
      ) : (
        <>
          <SpellsTopBar
            query={query}
            onQueryChange={setQuery}
            onOpenMenu={() => setDrawerOpen(true)}
          />

          <Box flex="1" overflowY="auto" p={3}>
            <SpellList
              spells={filteredSpells}
              onOpenDetails={(spell) => openSpellDialog(spell, shellRef)}
            />
          </Box>
        </>
      )}

      <SpellFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        value={filters}
        onChange={setFilters}
        computeMatchingCount={computeMatchingCount}
      />

      <spellDialog.Viewport />
    </Stack>
  );
};
