import { type FC, useRef, useState } from 'react';
import { Box, Stack } from '@chakra-ui/react';

import { MainDrawer } from '../components/MainDrawer';
import { useSpells } from '../hooks/useSpell';
import { useSpellSearch } from '../hooks/useSpellSearch';
import { SpellsTopBar } from '../components/layout/SpellsTopBar';
import { SpellList } from '../components//spell/SpellList';
import { LoadingSpinner } from '../components/overlays/LoadingSpinner';
import { openSpellDialog } from '../components/overlays/openSpellDialog';
import { spellDialog } from '../components/overlays/SpellDialog';

export const SpellsPage: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const shellRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useSpells();
  const { spells } = useSpellSearch(data, query);

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
              spells={spells}
              onOpenDetails={(spell) => openSpellDialog(spell, shellRef)}
            />
          </Box>
        </>
      )}

      <MainDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onNavigate={() => {
          setQuery('');
          setDrawerOpen(false);
        }}
      />

      <spellDialog.Viewport />
    </Stack>
  );
};
