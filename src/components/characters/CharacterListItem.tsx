import { Card, Badge, Group, Stack, Text, Button } from '@mantine/core';
import type { Character } from '../../types/character';
import { useUpdateCharacterLevel } from '../../hooks/useCharacters';
import { openLevelUpModal } from '../overlays/openLevelUpModal';
import { notifications } from '@mantine/notifications';

type Props = {
  character: Character;
  onClick: () => void;
};

export function CharacterListItem({ character, onClick }: Props) {
  const updateLevel = useUpdateCharacterLevel();

  const levelUp = () => {
    openLevelUpModal({
      character,
      onConfirm: (newLevel) => {
        if (newLevel === character.level) return;

        updateLevel.mutate(
          { characterId: character.id, level: newLevel },
          {
            onSuccess: (c) => {
              notifications.show({
                color: 'teal',
                title: 'Level updated',
                message: `${c.name} is now level ${c.level}.`,
              });
            },
            onError: (err: any) => {
              notifications.show({
                color: 'red',
                title: 'Failed to update level',
                message: err?.message ?? 'Please try again.',
              });
            },
          }
        );
      },
    });
  };

  return (
    <Card
      component="li"
      withBorder
      padding="sm"
      radius="md"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap={2} maw="80%">
          <Text fw={600} truncate>
            {character.name}
          </Text>
          <Text fz="sm" c="dimmed" truncate>
            {[character.class, character.race].filter(Boolean).join(' • ')}
          </Text>
        </Stack>
        <Stack>
          <Badge variant="light">Lvl {character.level}</Badge>
          <Button
            variant="light"
            color="red"
            size="compact-sm"
            onClick={(e) => {
              e.stopPropagation();
              levelUp();
            }}
            loading={updateLevel.isPending}
          >
            Level up
          </Button>
        </Stack>
      </Group>
    </Card>
  );
}
