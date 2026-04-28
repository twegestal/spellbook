import { Card, Badge, Group, Stack, Text, Button } from '@mantine/core';
import type { Character } from '../../types/character';
import {
  useUpdateCharacterClassLevel,
  useAddCharacterClass,
} from '../../hooks/useCharacters';
import { openLevelUpModal } from '../overlays/openLevelUpModal';
import { notifications } from '@mantine/notifications';

type Props = {
  character: Character;
  onClick: () => void;
};

export function CharacterListItem({ character, onClick }: Props) {
  const updateClassLevel = useUpdateCharacterClassLevel();
  const addCharacterClass = useAddCharacterClass();

  const classDisplay =
    character.classes.length > 0
      ? character.classes.map((c) => `${c.name} ${c.level}`).join(' / ')
      : character.class;

  const levelUp = () => {
    openLevelUpModal({
      character,
      onLevelUp: ({ classId, level }) => {
        updateClassLevel.mutate(
          { characterId: character.id, classId, level },
          {
            onSuccess: (c) => {
              notifications.show({
                color: 'teal',
                title: 'Level updated',
                message: `${c.name} updated successfully.`,
              });
            },
            onError: (err: any) => {
              notifications.show({
                color: 'red',
                title: 'Failed to update level',
                message: err?.message ?? 'Please try again.',
              });
            },
          },
        );
      },
      onAddClass: ({ className, level }) => {
        addCharacterClass.mutate(
          { characterId: character.id, class: className, level },
          {
            onSuccess: (c) => {
              notifications.show({
                color: 'teal',
                title: 'Class added',
                message: `${className} added to ${c.name}.`,
              });
            },
            onError: (err: any) => {
              notifications.show({
                color: 'red',
                title: 'Failed to add class',
                message: err?.message ?? 'Please try again.',
              });
            },
          },
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
            {[classDisplay, character.race].filter(Boolean).join(' • ')}
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
            loading={updateClassLevel.isPending || addCharacterClass.isPending}
          >
            Level up
          </Button>
        </Stack>
      </Group>
    </Card>
  );
}
