import {
  Card,
  Group,
  Text,
  Badge,
  Progress,
  ActionIcon,
  Loader,
  Tooltip,
  Stack,
} from '@mantine/core';
import { Plus, Minus } from 'lucide-react';
import type { CharacterResource } from '../../types/resources';

type Props = {
  resource: CharacterResource;
  label: string;
  description?: string;
  color?: string;
  onSpend: () => void;
  onRestore: () => void;
  isSpending?: boolean;
  isRestoring?: boolean;
};

export function ResourceCard({
  resource,
  label,
  description,
  color = 'blue',
  onSpend,
  onRestore,
  isSpending,
  isRestoring,
}: Props) {
  const { current, maximum } = resource;
  const pct = maximum > 0 ? Math.min(100, (current / maximum) * 100) : 0;
  const depleted = current === 0;

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb={4} align="flex-start">
        <Stack gap={2}>
          <Text fw={600}>{label}</Text>
          {description && (
            <Text fz="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
        <Group gap="xs" align="center">
          <Tooltip label="Spend 1">
            <ActionIcon
              variant="light"
              color="red"
              onClick={onSpend}
              disabled={depleted || isSpending}
              aria-label={`Spend 1 ${label}`}
            >
              {isSpending ? <Loader size="xs" /> : <Minus size={16} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Restore 1">
            <ActionIcon
              variant="light"
              color={color}
              onClick={onRestore}
              disabled={current >= maximum || isRestoring}
              aria-label={`Restore 1 ${label}`}
            >
              {isRestoring ? <Loader size="xs" /> : <Plus size={16} />}
            </ActionIcon>
          </Tooltip>
          <Badge variant={depleted ? 'outline' : 'light'} color={color}>
            {current}/{maximum}
          </Badge>
        </Group>
      </Group>
      <Progress
        value={pct}
        size="sm"
        radius="xl"
        color={color}
        striped={current > 0 && current < maximum}
        transitionDuration={150}
      />
    </Card>
  );
}
