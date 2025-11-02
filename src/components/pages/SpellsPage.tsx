import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ActionIcon,
  Group,
  Loader,
  Stack,
  TextInput,
  Center,
} from '@mantine/core';
import { X, Filter, Search } from 'lucide-react';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import { useSpells } from '../../hooks/useSpell';
import { useSpellSearch } from '../../hooks/useSpellSearch';
import { SpellList } from '../spell/SpellList';
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

export default function SpellsPage() {
  const { setLeft, setRight } = useHeader();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);

  const { data, isLoading } = useSpells();
  const { spells: queryFiltered } = useSpellSearch(data, query);

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
    setLeft(
      <Group gap="xs" wrap="nowrap" w="100%">
        <TextInput
          placeholder="Search spells..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          leftSection={<Search size={18} style={{ opacity: 0.6 }} />}
          rightSection={
            query ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => setQuery('')}
              >
                <X size={16} />
              </ActionIcon>
            ) : null
          }
          radius="md"
          size="sm"
          styles={{
            input: {
              minWidth: 220,
              fontSize: 14,
            },
          }}
        />
      </Group>
    );

    setRight(
      <ActionIcon
        aria-label="Open filters"
        variant="subtle"
        onClick={() => setDrawerOpen(true)}
      >
        <Filter size={18} />
      </ActionIcon>
    );
  }, [query, setLeft, setRight]);

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
        <SpellList
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
