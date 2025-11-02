import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import type { Ability, SpellFilters, TriBool } from '../../types/filters';
import {
  LEVELS,
  ABILITIES,
  CLASSES,
  SCHOOLS,
  levelLabel,
} from '../../constants/dnd';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: SpellFilters;
  onChange: (next: SpellFilters) => void;
  computeMatchingCount: (filters: SpellFilters) => number;
};

export function SpellFiltersDrawer({
  open,
  onOpenChange,
  value,
  onChange,
  computeMatchingCount,
}: Props) {
  const [draft, setDraft] = useState<SpellFilters>(value);
  const [opened, setOpened] = useState<string | null>('levels');

  useEffect(() => setDraft(value), [value, open]);
  useEffect(() => {
    if (open) setOpened('levels');
  }, [open]);

  const setLevels = useCallback(
    (lvl: number, checked: boolean) =>
      setDraft((d) => ({
        ...d,
        levels: checked
          ? [...d.levels, lvl]
          : d.levels.filter((x) => x !== lvl),
      })),
    []
  );
  const setClass = useCallback(
    (clsIdx: string, checked: boolean) =>
      setDraft((d) => ({
        ...d,
        classes: checked
          ? [...d.classes, clsIdx]
          : d.classes.filter((x) => x !== clsIdx),
      })),
    []
  );
  const setSaving = useCallback(
    (ability: Ability, checked: boolean) =>
      setDraft((d) => ({
        ...d,
        savingThrows: checked
          ? [...d.savingThrows, ability]
          : d.savingThrows.filter((x) => x !== ability),
      })),
    []
  );
  const setSchool = useCallback(
    (schoolIdx: string, checked: boolean) =>
      setDraft((d) => ({
        ...d,
        schools: checked
          ? [...d.schools, schoolIdx]
          : d.schools.filter((x) => x !== schoolIdx),
      })),
    []
  );
  const setRitual = (ritual: TriBool) => setDraft((d) => ({ ...d, ritual }));
  const setConcentration = (concentration: TriBool) =>
    setDraft((d) => ({ ...d, concentration }));

  const clearAll = () =>
    setDraft({
      levels: [],
      classes: [],
      savingThrows: [],
      ritual: 'any',
      concentration: 'any',
      schools: [],
    });

  const activeCount = useMemo(() => {
    const setSize = (arr: unknown[]) => new Set(arr as unknown[]).size;
    return (
      setSize(draft.levels) +
      setSize(draft.classes) +
      setSize(draft.savingThrows) +
      setSize(draft.schools) +
      (draft.ritual !== 'any' ? 1 : 0) +
      (draft.concentration !== 'any' ? 1 : 0)
    );
  }, [draft]);

  const liveCount = useMemo(
    () => computeMatchingCount(draft),
    [computeMatchingCount, draft]
  );

  const ClearBadge = ({
    visible,
    onClear,
  }: {
    visible: boolean;
    onClear: () => void;
  }) =>
    !visible ? null : (
      <Badge
        variant="light"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        style={{ cursor: 'pointer' }}
      >
        Clear
      </Badge>
    );

  return (
    <Drawer
      opened={open}
      onClose={() => onOpenChange(false)}
      position="right"
      size={480}
      withCloseButton
      title={
        <Group gap="xs">
          <Text fw={600}>Filter spells</Text>
          {activeCount ? <Badge>{activeCount}</Badge> : null}
        </Group>
      }
      styles={{
        content: { overflowX: 'hidden' },
      }}
    >
      <Drawer.Body
        p={0}
        style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
      >
        <ScrollArea style={{ flex: 1, padding: 16 }} scrollbars="y">
          <Stack gap="md">
            <Accordion value={opened} onChange={setOpened}>
              <Accordion.Item value="levels">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>Level</Text>
                    <ClearBadge
                      visible={draft.levels.length > 0}
                      onClear={() => setDraft((d) => ({ ...d, levels: [] }))}
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="xs">
                    {LEVELS.map((lvl) => {
                      const checked = draft.levels.includes(lvl);
                      return (
                        <Checkbox
                          key={lvl}
                          w="100%"
                          label={levelLabel(lvl)}
                          checked={checked}
                          onChange={(e) =>
                            setLevels(lvl, e.currentTarget.checked)
                          }
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="classes">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>Class</Text>
                    <ClearBadge
                      visible={draft.classes.length > 0}
                      onClear={() => setDraft((d) => ({ ...d, classes: [] }))}
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="xs">
                    {CLASSES.map((c) => {
                      const checked = draft.classes.includes(c.index);
                      return (
                        <Checkbox
                          key={c.index}
                          w="100%"
                          label={c.name}
                          checked={checked}
                          onChange={(e) =>
                            setClass(c.index, e.currentTarget.checked)
                          }
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="schools">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>School</Text>
                    <ClearBadge
                      visible={draft.schools.length > 0}
                      onClear={() => setDraft((d) => ({ ...d, schools: [] }))}
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="xs">
                    {SCHOOLS.map((s) => {
                      const checked = draft.schools.includes(s.index);
                      return (
                        <Checkbox
                          key={s.index}
                          w="100%"
                          label={s.name}
                          checked={checked}
                          onChange={(e) =>
                            setSchool(s.index, e.currentTarget.checked)
                          }
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="saving">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>Saving throw</Text>
                    <ClearBadge
                      visible={draft.savingThrows.length > 0}
                      onClear={() =>
                        setDraft((d) => ({ ...d, savingThrows: [] }))
                      }
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 3, sm: 3 }} spacing="xs">
                    {ABILITIES.map((a) => {
                      const checked = draft.savingThrows.includes(a as any);
                      return (
                        <Checkbox
                          key={a}
                          w="100%"
                          label={a}
                          checked={checked}
                          onChange={(e) =>
                            setSaving(a as any, e.currentTarget.checked)
                          }
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="ritual">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>Ritual</Text>
                    <ClearBadge
                      visible={draft.ritual !== 'any'}
                      onClear={() => setRitual('any')}
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Chip.Group
                    multiple={false}
                    value={draft.ritual}
                    onChange={(val) => setRitual((val as TriBool) ?? 'any')}
                  >
                    <Group gap="xs">
                      <Chip value="any">Any</Chip>
                      <Chip value="yes">Yes</Chip>
                      <Chip value="no">No</Chip>
                    </Group>
                  </Chip.Group>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="concentration">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text>Concentration</Text>
                    <ClearBadge
                      visible={draft.concentration !== 'any'}
                      onClear={() => setConcentration('any')}
                    />
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Chip.Group
                    multiple={false}
                    value={draft.concentration}
                    onChange={(val) =>
                      setConcentration((val as TriBool) ?? 'any')
                    }
                  >
                    <Group gap="xs">
                      <Chip value="any">Any</Chip>
                      <Chip value="yes">Yes</Chip>
                      <Chip value="no">No</Chip>
                    </Group>
                  </Chip.Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Button variant="subtle" onClick={clearAll}>
              Clear all
            </Button>
          </Stack>
        </ScrollArea>

        <Box
          p="md"
          style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
          <Button
            fullWidth
            variant="outline"
            onClick={() => {
              onChange(draft);
              onOpenChange(false);
            }}
          >
            Show {liveCount} {liveCount === 1 ? 'spell' : 'spells'}
          </Button>
        </Box>
      </Drawer.Body>
    </Drawer>
  );
}
