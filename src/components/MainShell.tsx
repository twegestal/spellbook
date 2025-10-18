import { type FC, useState, useMemo, useRef } from 'react';
import {
  Box,
  Stack,
  IconButton,
  Text,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { Menu, X } from 'lucide-react';
import { LuSearch } from 'react-icons/lu';
import { MainDrawer } from './MainDrawer';
import { useSpells } from '../hooks/useSpell';
import type { Spell } from '../types/spells';
import { SpellListItem } from './SpellListItem';
import { spellDialog } from './overlays/SpellDialog';
import { SpellOverlayContent } from './SpellOverLayContent';

export const MainShell: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { data } = useSpells();

  const shellRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo<Spell[]>(
    () =>
      (data?.results ?? []).slice().sort(
        (a, b) =>
          (a.level ?? 0) - (b.level ?? 0) ||
          (a.name ?? '').localeCompare(b.name ?? '', undefined, {
            sensitivity: 'base',
          })
      ),
    [data]
  );

  const spells = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((s) => (s.name ?? '').toLowerCase().includes(q));
  }, [sorted, query]);

  return (
    <Stack ref={shellRef} minH="100dvh" gap={0}>
      <Box
        h="56px"
        px={3}
        display="flex"
        alignItems="center"
        gap={2}
        borderBottomWidth="1px"
        position="sticky"
        top={0}
        bg="bg"
        zIndex={1}
      >
        <InputGroup flex={'1'} startElement={<LuSearch />}>
          <Input
            size="sm"
            value={query}
            placeholder="Search spells…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        {query ? (
          <IconButton
            aria-label="Clear search"
            variant="ghost"
            size="lg"
            onClick={() => setQuery('')}
          >
            <X />
          </IconButton>
        ) : null}
        <IconButton
          aria-label="Open menu"
          variant="ghost"
          size="lg"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu />
        </IconButton>
      </Box>

      <Box flex="1" overflowY="auto" p={3}>
        {spells?.length ? (
          <Stack as="ul" gap={3}>
            {spells.map((spell) => (
              <SpellListItem
                key={spell.index}
                spell={spell}
                onOpenDetails={() =>
                  spellDialog.open(spell.index ?? spell.name, {
                    title: spell.name,
                    content: <SpellOverlayContent spell={spell} />,
                    container: shellRef,
                  })
                }
              />
            ))}
          </Stack>
        ) : (
          <Box display="grid" placeItems="center" h="full" py={8}>
            <Text opacity={0.7}>No spells to show yet.</Text>
          </Box>
        )}
      </Box>

      <MainDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <spellDialog.Viewport />
    </Stack>
  );
};
