import { ActionIcon, Box, Drawer, Group, Text } from '@mantine/core';
import { X } from 'lucide-react';
import { SlotDot } from './SlotDot';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  levelLabel: string;
  maximum: number;
  spent: number;
  onToggle: (slotIndex: number) => void;
  disabled?: boolean;
};

export function MagnifiedSlotPicker({
  isOpen,
  onClose,
  levelLabel,
  maximum,
  spent,
  onToggle,
  disabled,
}: Props) {
  const border = 'var(--mantine-color-default-border)';

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="bottom"
      size={260}
      withCloseButton={false}
      overlayProps={{ opacity: 0.35, blur: 2 }}
      styles={{
        body: { padding: 0 },
        content: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
          borderTop: `1px solid ${border}`,
        },
      }}
    >
      <Box p="md">
        <Group justify="space-between" mb="md" wrap="nowrap">
          <Text fw={600}>{levelLabel}</Text>
          <ActionIcon
            aria-label="Close"
            variant="subtle"
            onClick={onClose}
            radius="md"
          >
            <X size={18} />
          </ActionIcon>
        </Group>

        <Group justify="center" gap="sm" py="md">
          {Array.from({ length: maximum }, (_, i) => {
            const index = i + 1;
            const isSpent = i < spent;
            return (
              <button
                disabled={disabled}
                key={i}
                aria-label={`Toggle slot ${index}`}
                onClick={() => {
                  onToggle(index);
                  onClose();
                }}
                style={{
                  background: 'transparent',
                  padding: 0,
                  border: 'none',
                  lineHeight: 0,
                  cursor: 'pointer',
                }}
              >
                <SlotDot isSpent={isSpent} onClick={() => {}} size={40} />
              </button>
            );
          })}
        </Group>

        <Box
          h={0}
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)',
          }}
        />
      </Box>
    </Drawer>
  );
}
