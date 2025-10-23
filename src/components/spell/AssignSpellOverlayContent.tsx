import type { FC } from 'react';
import { Heading, Box, Button, Stack, Text, Separator } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import type { Character } from '../../types/character';
import { useCharacters } from '../../hooks/useCharacters';
import { LoadingSpinner } from '../overlays/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { CharacterListItem } from '../characters/CharacterListItem';
import { useAddKnownSpell } from '../../hooks/useCharacters';
import { toaster } from '../ui';
import { spellDialog } from '../overlays/SpellDialog';

type Props = { spell: Spell };

export const AssignSpellOverlayContent: FC<Props> = ({ spell }) => {
  const { data, isLoading, isError, error } = useCharacters();
  const { mutateAsync, isPending } = useAddKnownSpell();
  const navigate = useNavigate();

  const handleCreateCharacter = () => navigate('/characters/new');

  if (isLoading || isPending) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center" p={6}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack gap={3} py={6}>
        <Heading size="md">Characters</Heading>
        <Text color="red.500">Failed to load characters.</Text>
        <Text fontSize="sm" opacity={0.8}>
          {(error as Error)?.message ?? 'Unknown error'}
        </Text>
      </Stack>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Stack gap={4} py={6} align="flex-start">
        <Heading size="md">Characters</Heading>
        <Text opacity={0.85}>
          You don’t have any characters yet. Create your first one to get
          started.
        </Text>
        <Button
          onClick={handleCreateCharacter}
          variant="solid"
          colorPalette="purple"
        >
          Create character
        </Button>
      </Stack>
    );
  }

  const spellIndex = String(spell.id ?? spell.name);
  const dialogId = `assign-${spellIndex}`;

  return (
    <Stack gap={4} py={4} px={3}>
      <Separator />
      <Stack as="ul" gap={3}>
        {data.map((c: Character) => (
          <CharacterListItem
            key={c.id}
            character={c}
            onClick={async () => {
              if (isPending) return;
              try {
                await mutateAsync({ characterId: c.id, spellId: spellIndex });
                toaster.create({
                  title: 'Spell added',
                  description: `Added "${spell.name}" to ${c.name}.`,
                  type: 'success',
                  closable: true,
                });
                spellDialog.close(dialogId);
              } catch (e: any) {
                const message =
                  e?.message ?? 'Failed to add spell. Please try again.';
                toaster.create({
                  title: 'Could not add spell',
                  description: message,
                  type: 'error',
                  closable: true,
                });
              }
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
