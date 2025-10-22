import { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Stack, Tabs, Text } from '@chakra-ui/react';
import {
  useCharacterKnownSpells,
  useCharacterPreparedSpells,
} from '../hooks/useCharacters';
import { LoadingSpinner } from '../components/overlays/LoadingSpinner';
import { openSpellDialog } from '../components/overlays/openSpellDialog';
import { spellDialog } from '../components/overlays/SpellDialog';
import { KnownSpellList } from '../components/spell/KnownSpellList';
import { PreparedSpellList } from '../components/spell/PreparedSpellList';

export const CharacterDetailsPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const shellRef = useRef<HTMLDivElement>(null);

  const {
    data: knownSpells,
    isLoading: loadingKnown,
    isError: errorKnown,
    error: knownErr,
  } = useCharacterKnownSpells(id);

  const {
    data: preparedSpells,
    isLoading: loadingPrepared,
    isError: errorPrepared,
    error: preparedErr,
  } = useCharacterPreparedSpells(id);

  const sortedKnownSpells = useMemo(() => {
    const arr = knownSpells ? [...knownSpells] : [];
    arr.sort((a, b) => {
      const lvl = (a.level ?? 99) - (b.level ?? 99);
      return lvl !== 0 ? lvl : a.name.localeCompare(b.name);
    });
    return arr;
  }, [knownSpells]);

  const preparedSet = useMemo(
    () => new Set((preparedSpells ?? []).map((s) => String(s.index))),
    [preparedSpells]
  );

  const anyLoading = loadingKnown || loadingPrepared;
  const anyError = errorKnown || errorPrepared;

  if (anyLoading) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center" p={6}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (anyError) {
    return (
      <Stack gap={3} py={6} px={3}>
        <Heading size="md">Character</Heading>
        <Text color="red.500">Failed to load character spells.</Text>
        <Text fontSize="sm" opacity={0.8}>
          {(knownErr as Error)?.message ||
            (preparedErr as Error)?.message ||
            'Unknown error'}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack ref={shellRef} minH="100dvh" gap={0} px={3} py={4}>
      <Heading size="md" mb={2}>
        Spellbook
      </Heading>

      <Tabs.Root defaultValue="known">
        <Tabs.List>
          <Tabs.Trigger value="known">Known</Tabs.Trigger>
          <Tabs.Trigger value="prepared">Prepared</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="known">
          {sortedKnownSpells.length > 0 ? (
            <KnownSpellList
              characterId={id}
              spells={sortedKnownSpells}
              preparedSet={preparedSet}
              onOpenDetails={(spell) => openSpellDialog(spell, shellRef)}
            />
          ) : (
            <Box py={6}>
              <Text opacity={0.8}>
                This character doesn’t know any spells yet.
              </Text>
            </Box>
          )}
        </Tabs.Content>

        <Tabs.Content value="prepared">
          {preparedSpells && preparedSpells.length > 0 ? (
            <PreparedSpellList
              characterId={id}
              spells={preparedSpells}
              onOpenDetails={(spell) => openSpellDialog(spell, shellRef)}
              // optional: onCast={(spell) => ...}
            />
          ) : (
            <Box py={6}>
              <Text opacity={0.8}>No spells are prepared.</Text>
            </Box>
          )}
        </Tabs.Content>
      </Tabs.Root>

      <spellDialog.Viewport />
    </Stack>
  );
};
