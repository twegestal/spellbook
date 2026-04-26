import { Modal, NumberInput, Button, Group, Text, Stack } from '@mantine/core';
import { useState } from 'react';

type Props = {
  opened: boolean;
  onClose: () => void;
  label: string;
  max: number;
  onConfirm: (qty: number) => void;
  busy?: boolean;
};

export function SpendResourceModal({
  opened,
  onClose,
  label,
  max,
  onConfirm,
  busy,
}: Props) {
  const [qty, setQty] = useState<number | string>(1);

  const handleConfirm = () => {
    const value = Number(qty);
    if (!value || value < 1 || value > max) return;
    onConfirm(value);
  };

  return (
    <Modal
      opened={opened}
      onClose={busy ? () => {} : onClose}
      title={`Use ${label}`}
      centered
      size="sm"
    >
      <Stack gap="md">
        <Text fz="sm" c="dimmed">
          {max} remaining. How many HP do you want to spend?
        </Text>
        <NumberInput
          label="Amount"
          min={1}
          max={max}
          value={qty}
          onChange={setQty}
          disabled={busy}
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleConfirm}
            loading={busy}
            disabled={Number(qty) < 1 || Number(qty) > max}
          >
            Spend {qty} HP
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
