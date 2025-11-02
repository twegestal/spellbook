import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { Spell } from '../../types/spells';
import type { Character } from '../../types/character';
import { useCharacters } from '../../hooks/useCharacters';
import { useAddKnownSpell } from '../../hooks/useCharacters';

type Props = {
  spell: Spell;
  modalId: string;
};

export function AssignSpellModalContent({ spell, modalId }: Props) {
  const { data, isLoading, isError, error } = useCharacters();
  const { mutateAsync, isPending } = useAddKnownSpell();
  const navigate = useNavigate();

  if (isLoading || isPending) {
    return (
      <Box mih="40dvh" style={{ display: 'grid', placeItems: 'center' }} p="lg">
        <Loader />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack gap="xs" py="md">
        <Title order={4}>Characters</Title>
        <Text c="red">Failed to load characters.</Text>
        <Text size="sm" opacity={0.8}>
          {(error as Error)?.message ?? 'Unknown error'}
        </Text>
      </Stack>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Stack gap="md" py="md" align="flex-start">
        <Title order={4}>Characters</Title>
        <Text opacity={0.85}>
          You don’t have any characters yet. Create your first one to get
          started.
        </Text>
        <Button
          onClick={() => navigate('/characters/new')}
          variant="filled"
          color="grape"
        >
          Create character
        </Button>
      </Stack>
    );
  }

  const spellIndex = String(spell.id ?? spell.name);

  return (
    <Stack gap="md" py="sm">
      <Divider />
      <Stack
        component="ul"
        gap="xs"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {data.map((c: Character) => (
          <Paper
            key={c.id}
            component="li"
            withBorder
            p="sm"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              if (isPending) return;
              try {
                await mutateAsync({ characterId: c.id, spellId: spellIndex });
                modals.close(modalId);
              } catch (e: any) {
                notifications.show({
                  title: 'Could not add spell',
                  message:
                    e?.message ?? 'Failed to add spell. Please try again.',
                  color: 'red',
                });
              }
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Text fw={500}>{c.name}</Text>
              <Text size="sm" c="dimmed">
                Click to assign
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
