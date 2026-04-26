import {
  Paper,
  Stack,
  Text,
  SimpleGrid,
  Card,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  Loader,
} from '@mantine/core';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  useInvocations,
  useKnownInvocations,
  useAddKnownInvocation,
  useDeleteKnownInvocation,
  mergeKnownWithInvocationCatalog,
} from '../../hooks/useInvocations';
import { AddInvocationModal } from './AddInvocationModal';

type Props = {
  characterId: string;
};

export function InvocationsPanel({ characterId }: Props) {
  const { data: catalog, isLoading: catalogLoading } = useInvocations();
  const { data: knownRows, isLoading: knownLoading } =
    useKnownInvocations(characterId);

  const addKnown = useAddKnownInvocation(characterId);
  const delKnown = useDeleteKnownInvocation(characterId);

  const { knownOptions, availableOptions } = mergeKnownWithInvocationCatalog(
    catalog,
    knownRows,
  );

  const [addOpen, setAddOpen] = useState(false);
  const [removingIdx, setRemovingIdx] = useState<string | null>(null);

  const handleAdd = (idx: string) => {
    addKnown.mutate({ idx }, { onSuccess: () => setAddOpen(false) });
  };

  const handleRemove = (idx: string) => {
    setRemovingIdx(idx);
    delKnown.mutate({ idx }, { onSettled: () => setRemovingIdx(null) });
  };

  const loadingAny = catalogLoading || knownLoading;
  const addDisabled = !availableOptions.length || addKnown.isPending;

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Eldritch Invocations</Text>
          <Badge variant="light" color="violet">
            {knownOptions.length} known
          </Badge>
        </Group>

        {loadingAny && !knownOptions.length ? (
          <Text c="dimmed" size="sm">
            Loading invocations…
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {knownOptions.map((inv) => {
              const isRemovingThis = removingIdx === inv.__idx;

              return (
                <Card
                  key={inv.__idx}
                  withBorder
                  radius="md"
                  p="md"
                  style={isRemovingThis ? { opacity: 0.6 } : undefined}
                >
                  <Group justify="space-between" mb={4} align="flex-start">
                    <Text fw={600}>{inv.name}</Text>
                    <Group gap="xs">
                      {inv.prerequisite_level > 1 && (
                        <Badge variant="light" color="orange" size="sm">
                          Lv {inv.prerequisite_level}+
                        </Badge>
                      )}
                      {inv.prerequisite_pact && (
                        <Badge variant="light" color="violet" size="sm">
                          {inv.prerequisite_pact}
                        </Badge>
                      )}
                      <Tooltip label="Remove">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleRemove(inv.__idx)}
                          disabled={delKnown.isPending || isRemovingThis}
                          aria-label={`Remove ${inv.name}`}
                        >
                          {isRemovingThis ? (
                            <Loader size="xs" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>

                  {inv.description && (
                    <Text size="sm" c="dimmed">
                      {inv.description}
                    </Text>
                  )}
                </Card>
              );
            })}

            <Card
              withBorder
              radius="md"
              p="md"
              onClick={() => !addDisabled && setAddOpen(true)}
              style={{
                cursor: addDisabled ? 'default' : 'pointer',
                opacity: addDisabled ? 0.6 : 1,
                transition: 'opacity 120ms ease',
              }}
            >
              <Group justify="center" mih={64}>
                <Group gap="xs" align="center">
                  {addKnown.isPending ? (
                    <Loader size="sm" />
                  ) : (
                    <Plus size={18} />
                  )}
                  <Text fw={600}>
                    {availableOptions.length
                      ? addKnown.isPending
                        ? 'Adding…'
                        : 'Add invocation'
                      : 'No more options'}
                  </Text>
                </Group>
              </Group>
            </Card>
          </SimpleGrid>
        )}
      </Paper>

      <AddInvocationModal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        options={availableOptions}
        onPick={handleAdd}
        busy={addKnown.isPending}
      />
    </Stack>
  );
}
