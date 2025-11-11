import {
  Modal,
  TextInput,
  ScrollArea,
  Stack,
  Card,
  Group,
  Text,
  Badge,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import type { MetamagicOption } from '../../types/metamagic';

type Props = {
  opened: boolean;
  onClose: () => void;
  options: (MetamagicOption & { __idx: string })[];
  onPick: (idx: string) => void;
  busy?: boolean;
};

export function AddMetamagicModal({
  opened,
  onClose,
  options,
  onPick,
  busy,
}: Props) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(s) ||
        (o.description ?? '').toLowerCase().includes(s)
    );
  }, [q, options]);

  return (
    <Modal
      opened={opened}
      onClose={busy ? () => {} : onClose}
      title="Add metamagic"
      centered
    >
      <Stack
        gap="sm"
        style={busy ? { opacity: 0.7, pointerEvents: 'none' } : undefined}
      >
        <TextInput
          placeholder="Search metamagic"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          disabled={busy}
        />
        <ScrollArea.Autosize mah={360} type="hover">
          <Stack>
            {filtered.map((m) => (
              <Card
                key={m.__idx}
                withBorder
                radius="md"
                p="md"
                onClick={() => !busy && onPick(m.__idx)}
                style={{ cursor: busy ? 'default' : 'pointer' }}
              >
                <Group justify="space-between" mb={4}>
                  <Text fw={600}>{m.name}</Text>
                  <Badge variant="light" color="grape">
                    {m.cost} SP
                  </Badge>
                </Group>
                {m.description && (
                  <Text size="sm" c="dimmed">
                    {m.description}
                  </Text>
                )}
              </Card>
            ))}
            {!filtered.length && (
              <Text c="dimmed" size="sm">
                No results.
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
}
