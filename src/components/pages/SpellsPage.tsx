import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActionIcon, Loader, Stack, Center } from '@mantine/core';
import { Filter } from 'lucide-react';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import { useSpells } from '../../hooks/useSpell';
import { useSpellSearch } from '../../hooks/useSpellSearch';
import { openSpellModal } from '../overlays/openSpellModal';
import {
  emptyFilters,
  getSavingThrow,
  spellHasAnyClass,
  spellMatchesSchool,
  triMatch,
  type SpellFilters,
} from '../../types/filters';
import { SpellFiltersDrawer } from '../filters/SpellFilterDrawer';
import SpellSearch from '../SpellSearch';
import { useDebouncedValue } from '@mantine/hooks';
import { VirtualizedSpellList } from '../VirtualizedSpellList';

export default function SpellsPage() {
  const { setLeft, setRight } = useHeader();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 100);
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);

  const { data, isLoading } = useSpells();
  const { spells: queryFiltered } = useSpellSearch(data, debouncedQuery);

  const filterSpell = useCallback((s: any, f: SpellFilters) => {
    if (f.levels.length && !f.levels.includes(s.level)) return false;
    if (!spellHasAnyClass(s, f.classes)) return false;
    if (!spellMatchesSchool(s, f.schools)) return false;
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

  useEffect(() => {
    setLeft(<SpellSearch initialValue={query} onChange={setQuery} />);
    setRight(
      <ActionIcon
        aria-label="Open filters"
        variant="subtle"
        onClick={() => setDrawerOpen(true)}
      >
        <Filter size={18} />
      </ActionIcon>
    );
    return () => {
      setLeft(null);
      setRight(null);
    };
  }, [setLeft, setRight]);

  if (isLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <Stack gap="lg">
        <VirtualizedSpellList
          spells={filteredSpells ?? []}
          onOpenDetails={(spell) => openSpellModal(spell)}
        />
      </Stack>

      <SpellFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        value={filters}
        onChange={setFilters}
        computeMatchingCount={computeMatchingCount}
      />
    </>
  );
}
