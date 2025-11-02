import { Card, Badge, Group, Stack, Text } from '@mantine/core';
import type { Character } from '../../types/character';

type Props = {
  character: Character;
  onClick: () => void;
};

export function CharacterListItem({ character, onClick }: Props) {
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

        <Badge variant="light">Lvl {character.level}</Badge>
      </Group>
    </Card>
  );
}
