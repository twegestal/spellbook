import { modals } from '@mantine/modals';
import { Button, Group, NumberInput, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import type { Character } from '../../types/character';

export function openLevelUpModal(opts: {
  character: Character;
  onConfirm: (newLevel: number) => void;
}) {
  const { character, onConfirm } = opts;
  const min = 1;
  const max = 20;
  const initial = Math.min(max, Math.max(min, (character.level ?? 1) + 1));
  let modalId: string;

  const Content = () => {
    const [value, setValue] = useState<string | number>(initial);

    const handleConfirm = () => {
      const raw = typeof value === 'number' ? value : Number(value);
      const clamped = Math.min(
        max,
        Math.max(min, Number.isFinite(raw) ? raw : initial)
      );
      onConfirm(clamped);
      modals.close(modalId);
    };

    return (
      <Stack gap="md">
        <Text>
          Choose a new level for <b>{character.name}</b>.
        </Text>
        <NumberInput
          label="Level"
          value={value}
          min={min}
          max={max}
          stepHoldDelay={300}
          stepHoldInterval={100}
          clampBehavior="strict"
          onChange={setValue}
        />
        <Group justify="flex-end" mt="xs">
          <Button variant="subtle" onClick={() => modals.close(modalId)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Group>
      </Stack>
    );
  };

  modalId = modals.open({
    title: 'Level up',
    centered: true,
    withCloseButton: true,
    size: 'sm',
    children: <Content />,
  });
}
