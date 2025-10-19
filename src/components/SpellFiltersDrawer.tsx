// components/SpellFiltersDrawer.tsx
import { type FC, useMemo, useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Button,
  CloseButton,
  Stack,
  Box,
  Accordion,
  Span,
  Checkbox,
  RadioGroup,
  Badge,
  HStack,
} from '@chakra-ui/react';
import type { SpellFilters, TriBool, Ability } from '../types/filters';
import { LEVELS, ABILITIES, CLASSES, levelLabel } from '../constants/dnd';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: SpellFilters;
  onChange: (next: SpellFilters) => void;
  computeMatchingCount: (filters: SpellFilters) => number;
};

export const SpellFiltersDrawer: FC<Props> = ({
  open,
  onOpenChange,
  value,
  onChange,
  computeMatchingCount,
}) => {
  const [draft, setDraft] = useState<SpellFilters>(value);
  useEffect(() => setDraft(value), [value, open]);

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

  const setRitual = (ritual: TriBool) => setDraft((d) => ({ ...d, ritual }));
  const setConcentration = (concentration: TriBool) =>
    setDraft((d) => ({ ...d, concentration }));

  const activeCount = useMemo(() => {
    let c = 0;
    if (draft.levels.length) c++;
    if (draft.classes.length) c++;
    if (draft.savingThrows.length) c++;
    if (draft.ritual !== 'any') c++;
    if (draft.concentration !== 'any') c++;
    return c;
  }, [draft]);

  // 🔴 live preview count based on the DRAFT (not yet applied)
  const liveCount = useMemo(
    () => computeMatchingCount(draft),
    [computeMatchingCount, draft]
  );

  return (
    <Drawer.Root
      placement="end"
      size={{ base: 'full', sm: 'xs' }}
      open={open}
      onOpenChange={(d) => onOpenChange(typeof d === 'boolean' ? d : d.open)}
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content display="flex" flexDirection="column" maxH="100dvh">
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" position="absolute" top="4" right="4" />
          </Drawer.CloseTrigger>

          <Drawer.Header>
            <Drawer.Title>
              Filter spells{' '}
              {activeCount ? (
                <Badge ml="2" colorPalette="purple">
                  {activeCount}
                </Badge>
              ) : null}
            </Drawer.Title>
          </Drawer.Header>

          <Drawer.Body flex="1" overflowY="auto">
            <Stack gap={4}>
              <Accordion.Root defaultValue={['levels']}>
                {/* Level */}
                <Accordion.Item value="levels">
                  <Accordion.ItemTrigger>
                    <Span flex="1">Level</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <HStack gap="3" wrap="wrap">
                        {LEVELS.map((lvl) => {
                          const checked = draft.levels.includes(lvl);
                          return (
                            <Checkbox.Root
                              key={lvl}
                              checked={checked}
                              onCheckedChange={(e) =>
                                setLevels(lvl, !!e.checked)
                              }
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <Checkbox.Label>{levelLabel(lvl)}</Checkbox.Label>
                            </Checkbox.Root>
                          );
                        })}
                      </HStack>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                {/* Class */}
                <Accordion.Item value="classes">
                  <Accordion.ItemTrigger>
                    <Span flex="1">Class</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <HStack gap="3" wrap="wrap">
                        {CLASSES.map((c) => {
                          const checked = draft.classes.includes(c.index);
                          return (
                            <Checkbox.Root
                              key={c.index}
                              checked={checked}
                              onCheckedChange={(e) =>
                                setClass(c.index, !!e.checked)
                              }
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <Checkbox.Label>{c.name}</Checkbox.Label>
                            </Checkbox.Root>
                          );
                        })}
                      </HStack>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                {/* Saving Throw */}
                <Accordion.Item value="saving">
                  <Accordion.ItemTrigger>
                    <Span flex="1">Saving throw</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <HStack gap="3" wrap="wrap">
                        {ABILITIES.map((a) => {
                          const checked = draft.savingThrows.includes(
                            a as Ability
                          );
                          return (
                            <Checkbox.Root
                              key={a}
                              checked={checked}
                              onCheckedChange={(e) =>
                                setSaving(a as Ability, !!e.checked)
                              }
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <Checkbox.Label>{a}</Checkbox.Label>
                            </Checkbox.Root>
                          );
                        })}
                      </HStack>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                {/* Ritual */}
                <Accordion.Item value="ritual">
                  <Accordion.ItemTrigger>
                    <Span flex="1">Ritual</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <RadioGroup.Root
                        value={draft.ritual}
                        onValueChange={(e) => setRitual(e.value as TriBool)}
                      >
                        <HStack gap="6">
                          {[
                            { label: 'Any', value: 'any' },
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                          ].map((opt) => (
                            <RadioGroup.Item key={opt.value} value={opt.value}>
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {opt.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                {/* Concentration */}
                <Accordion.Item value="concentration">
                  <Accordion.ItemTrigger>
                    <Span flex="1">Concentration</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <RadioGroup.Root
                        value={draft.concentration}
                        onValueChange={(e) =>
                          setConcentration(e.value as TriBool)
                        }
                      >
                        <HStack gap="6">
                          {[
                            { label: 'Any', value: 'any' },
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                          ].map((opt) => (
                            <RadioGroup.Item key={opt.value} value={opt.value}>
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {opt.label}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </HStack>
                      </RadioGroup.Root>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDraft({
                    levels: [],
                    classes: [],
                    savingThrows: [],
                    ritual: 'any',
                    concentration: 'any',
                  })
                }
              >
                Clear all
              </Button>
            </Stack>
          </Drawer.Body>

          <Drawer.Footer p={0}>
            <Box
              position="sticky"
              bottom="0"
              w="full"
              bg="bg"
              borderTopWidth="1px"
              px={4}
              pt={3}
              pb="calc(env(safe-area-inset-bottom) + 12px)"
            >
              <Stack w="full" gap={2}>
                <Button
                  variant="outline"
                  w="full"
                  colorPalette="purple"
                  onClick={() => {
                    onChange(draft); // apply the draft
                    onOpenChange(false);
                  }}
                >
                  Show {liveCount} {liveCount === 1 ? 'spell' : 'spells'}
                </Button>
              </Stack>
            </Box>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
