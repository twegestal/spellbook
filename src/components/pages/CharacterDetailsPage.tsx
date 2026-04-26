import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Center,
  Loader,
  Stack,
  Tabs,
  Text,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { AlertCircle } from 'lucide-react';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import {
  useCharacterKnownSpells,
  useCharacterPreparedSpells,
  useCharacters,
} from '../../hooks/useCharacters';
import {
  useSpellSlots,
  useLongRest,
  useShortRest,
} from '../../hooks/useSpellSlots';
import { openSpellModal } from '../overlays/openSpellModal';
import { KnownSpellList } from '../spell/KnownSpellList';
import { PreparedSpellList } from '../spell/PreparedSpellList';
import { RestPanel } from '../spell/RestPanel';
import { MetamagicPanel } from '../sorcery/MetamagicPanel';
import { InvocationsPanel } from '../warlock/InvocationsPanel';

export default function CharacterDetailsPage() {
  const { setLeft, setRight } = useHeader();
  const { id = '' } = useParams<{ id: string }>();
  const { data: characters } = useCharacters();

  const character = characters?.find((c) => c.id === id);
  const className = character?.class?.toLowerCase() ?? '';
  const isSorcerer = className === 'sorcerer';
  const isWarlock = className === 'warlock';

  const slotsQuery = useSpellSlots(id);
  const longRest = useLongRest(id);
  const shortRest = useShortRest(id);

  const [showRestOverlay, setShowRestOverlay] = useState(false);

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
    if (showRestOverlay && !longRest.isPending && !slotsQuery.isFetching) {
      setShowRestOverlay(false);
    }
  }, [showRestOverlay, longRest.isPending, slotsQuery.isFetching]);

  const openLongRestConfirm = useCallback(() => {
    openConfirmModal({
      title: 'Take a long rest?',
      children: <Text size="sm">This will reset your spell slots.</Text>,
      labels: { confirm: 'Yes, long rest', cancel: 'Cancel' },
      centered: true,
      onConfirm: () => {
        setShowRestOverlay(true);
        longRest.mutate(undefined, {
          onError: () => setShowRestOverlay(false),
        });
      },
    });
  }, [longRest]);

  const openShortRestConfirm = useCallback(() => {
    openConfirmModal({
      title: 'Take a short rest?',
      children: <Text size="sm">This will restore your Pact Magic slots.</Text>,
      labels: { confirm: 'Yes, short rest', cancel: 'Cancel' },
      centered: true,
      onConfirm: () => {
        setShowRestOverlay(true);
        shortRest.mutate(undefined, {
          onError: () => setShowRestOverlay(false),
        });
      },
    });
  }, [shortRest]);

  const longRestClickable = !showRestOverlay && !longRest.isPending;

  useEffect(() => {
    setLeft(<Text fw={600}>Spellbook</Text>);
    setRight(null);
  }, [setLeft, setRight, longRestClickable, openLongRestConfirm]);

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
    [preparedSpells],
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
    <Box pos="relative" mih="50vh">
      <LoadingOverlay visible={showRestOverlay} zIndex={1000} />
      <Stack gap="md">
        <Tabs defaultValue="known" variant="outline" radius="md">
          <Tabs.List mb="lg">
            <Tabs.Tab value="known">Spells</Tabs.Tab>
            {isSorcerer && <Tabs.Tab value="sorcery">Metamagic</Tabs.Tab>}
            {isWarlock && <Tabs.Tab value="invocations">Invocations</Tabs.Tab>}
            {!isSorcerer && !isWarlock && (
              <Tabs.Tab value="prepared">Prepared</Tabs.Tab>
            )}
            <Tabs.Tab value="rest">Remaining slots</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="known">
            {sortedKnownSpells.length > 0 ? (
              isSorcerer || isWarlock ? (
                <PreparedSpellList
                  characterId={id}
                  spells={sortedKnownSpells}
                  isSorcerer={isSorcerer}
                  onOpenDetails={(spell) => openSpellModal(spell)}
                />
              ) : (
                <KnownSpellList
                  characterId={id}
                  spells={sortedKnownSpells}
                  preparedSet={preparedSet}
                  onOpenDetails={(spell) => openSpellModal(spell)}
                />
              )
            ) : (
              <Text c="dimmed">
                This character doesn't know any spells yet.
              </Text>
            )}
          </Tabs.Panel>
          {!isSorcerer && !isWarlock && (
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
          )}
          {isSorcerer && (
            <Tabs.Panel value="sorcery">
              <MetamagicPanel characterId={id} />
            </Tabs.Panel>
          )}
          {isWarlock && (
            <Tabs.Panel value="invocations">
              <InvocationsPanel characterId={id} />
            </Tabs.Panel>
          )}
          <Tabs.Panel value="rest">
            <RestPanel
              longRestClickable={longRestClickable}
              onLongRest={openLongRestConfirm}
              onShortRest={isWarlock ? openShortRestConfirm : undefined}
              shortRestClickable={isWarlock && !shortRest.isPending}
              slots={slotsQuery.data}
              slotsLoading={slotsQuery.isLoading || slotsQuery.isFetching}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  );
}
