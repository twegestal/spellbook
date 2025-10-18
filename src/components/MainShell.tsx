import { type FC, useRef, useState } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { MainDrawer } from './MainDrawer';
import { useSpells } from '../hooks/useSpell';
import { useSpellSearch } from '../hooks/useSpellSearch';
import { TopBar } from './TopBar';
import { SpellList } from './SpellList';
import { LoadingSpinner } from './overlays/LoadingSpinner';
import { openSpellDialog } from './overlays/openSpellDialog';
import { spellDialog } from './overlays/SpellDialog';
import { CharactersView } from './characters/CharactersView';

export const MainShell: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'spells' | 'characters' | 'filters'>(
    'spells'
  );

  const shellRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useSpells();
  const { spells } = useSpellSearch(data, query);

  return (
    <Stack ref={shellRef} minH="100dvh" gap={0}>
      {view === 'spells' ? (
        isLoading ? (
          <Box flex="1" display="grid" placeItems="center" p={4}>
            <LoadingSpinner />
          </Box>
        ) : (
          <>
            <TopBar
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
        )
      ) : view === 'characters' ? (
        <CharactersView />
      ) : (
        <>
          <Box
            h="56px"
            px={3}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            borderBottomWidth="1px"
            position="sticky"
            top={0}
            bg="bg"
            zIndex={1}
          ></Box>
          <Box flex="1" display="grid" placeItems="center" p={8}>
            <Text opacity={0.8}>Filters coming soon…</Text>
          </Box>
        </>
      )}

      <MainDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onNavigate={(next) => {
          setView(next);
          if (next !== 'spells') setQuery('');
        }}
      />
      <spellDialog.Viewport />
    </Stack>
  );
};
