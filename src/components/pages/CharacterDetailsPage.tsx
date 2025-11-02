import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Center,
  Loader,
  Stack,
  Tabs,
  Text,
  Divider,
  Group,
  Badge,
} from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import {
  useCharacterKnownSpells,
  useCharacterPreparedSpells,
} from '../../hooks/useCharacters';
import { openSpellModal } from '../overlays/openSpellModal';
import { KnownSpellList } from '../spell/KnownSpellList';
import { PreparedSpellList } from '../spell/PreparedSpellList';

export default function CharacterDetailsPage() {
  const { setLeft, setRight } = useHeader();
  const { id = '' } = useParams<{ id: string }>();

  const {
    data: knownSpells,
    isLoading: loadingKnown,
    isError: errorKnown,
    error: knownErr,
  } = useCharacterKnownSpells(id);

  const {
    data: preparedSpells,
    isLoading: loadingPrepared,
    isError: errorPrepared,
    error: preparedErr,
  } = useCharacterPreparedSpells(id);

  useEffect(() => {
    setLeft(<Text fw={600}>Spellbook</Text>);
    setRight(
      <Group justify="flex-start">
        <Badge variant="light" color="blue">
          Long rest
        </Badge>
        <Badge variant="light" color="blue">
          Short rest
        </Badge>
      </Group>
    );
  }, [setLeft, setRight]);

  const sortedKnownSpells = useMemo(() => {
    const arr = knownSpells ? [...knownSpells] : [];
    arr.sort((a, b) => {
      const lvl = (a.level ?? 99) - (b.level ?? 99);
      return lvl !== 0 ? lvl : a.name.localeCompare(b.name);
    });
    return arr;
  }, [knownSpells]);

  const preparedSet = useMemo(
    () => new Set((preparedSpells ?? []).map((s) => String(s.id))),
    [preparedSpells]
  );

  const anyLoading = loadingKnown || loadingPrepared;
  const anyError = errorKnown || errorPrepared;

  if (anyLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (anyError) {
    return (
      <Alert
        color="red"
        variant="light"
        icon={<AlertCircle size={16} />}
        title="Failed to load character spells"
      >
        <Text fz="sm">
          {(knownErr as Error)?.message ||
            (preparedErr as Error)?.message ||
            'Unknown error'}
        </Text>
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Tabs defaultValue="known" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="known">Known</Tabs.Tab>
          <Tabs.Tab value="prepared">Prepared</Tabs.Tab>
        </Tabs.List>

        <Divider my="sm" />

        <Tabs.Panel value="known">
          {sortedKnownSpells.length > 0 ? (
            <KnownSpellList
              characterId={id}
              spells={sortedKnownSpells}
              preparedSet={preparedSet}
              onOpenDetails={(spell) => openSpellModal(spell)}
            />
          ) : (
            <Text c="dimmed">This character doesn’t know any spells yet.</Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="prepared">
          {preparedSpells && preparedSpells.length > 0 ? (
            <PreparedSpellList
              characterId={id}
              spells={preparedSpells}
              onOpenDetails={(spell) => openSpellModal(spell)}
            />
          ) : (
            <Text c="dimmed">No spells are prepared.</Text>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
