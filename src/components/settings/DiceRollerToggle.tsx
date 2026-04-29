import { Group, Stack, Switch, Text } from '@mantine/core';
import { usePreferences } from '../../hooks/usePreferences';

export function DiceRollerToggle() {
  const { prefs, update } = usePreferences();

  return (
    <Group justify="space-between">
      <Stack gap={2}>
        <Text fz="sm" fw={500}>
          Dice roller
        </Text>
        <Text fz="xs" c="dimmed">
          Show floating dice roller button
        </Text>
      </Stack>
      <Switch
        checked={prefs.showDiceRoller}
        onChange={(e) => update({ showDiceRoller: e.currentTarget.checked })}
      />
    </Group>
  );
}
