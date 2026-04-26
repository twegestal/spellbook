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
import type { InvocationOption } from '../../types/invocations';

type Props = {
  opened: boolean;
  onClose: () => void;
  options: (InvocationOption & { __idx: string })[];
  onPick: (idx: string) => void;
  busy?: boolean;
};

export function AddInvocationModal({
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
        (o.description ?? '').toLowerCase().includes(s),
    );
  }, [q, options]);

  return (
    <Modal
      opened={opened}
      onClose={busy ? () => {} : onClose}
      title="Add invocation"
      centered
    >
      <Stack
        gap="sm"
        style={busy ? { opacity: 0.7, pointerEvents: 'none' } : undefined}
      >
        <TextInput
          placeholder="Search invocations"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          disabled={busy}
        />
        <ScrollArea.Autosize mah={400} type="hover">
          <Stack>
            {filtered.map((inv) => (
              <Card
                key={inv.__idx}
                withBorder
                radius="md"
                p="md"
                onClick={() => !busy && onPick(inv.__idx)}
                style={{ cursor: busy ? 'default' : 'pointer' }}
              >
                <Group justify="space-between" mb={4} align="flex-start">
                  <Text fw={600}>{inv.name}</Text>
                  <Group gap="xs">
                    {inv.prerequisite_level > 1 && (
                      <Badge variant="light" color="orange">
                        Lv {inv.prerequisite_level}+
                      </Badge>
                    )}
                    {inv.prerequisite_pact && (
                      <Badge variant="light" color="violet">
                        Pact of the {inv.prerequisite_pact}
                      </Badge>
                    )}
                  </Group>
                </Group>
                {inv.description && (
                  <Text size="sm" c="dimmed">
                    {inv.description}
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
