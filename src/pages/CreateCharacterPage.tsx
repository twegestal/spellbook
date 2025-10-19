import {
  Box,
  Heading,
  Input,
  NumberInput,
  Select,
  Stack,
  Text,
  Portal,
  createListCollection,
  Theme,
  Button,
} from '@chakra-ui/react';
import { useRaces, useClasses } from '../hooks/useMetadata';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCharacter } from '../hooks/useCharacters';
import { LoadingSpinner } from '../components/overlays/LoadingSpinner';

const LoadingOverlay = () => (
  <Box
    position="fixed"
    inset={0}
    bg="blackAlpha.600"
    display="grid"
    placeItems="center"
    zIndex={9999}
  >
    <LoadingSpinner />
  </Box>
);

export const CreateCharacterPage = () => {
  const { data: racesData } = useRaces();
  const { data: classesData } = useClasses();

  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useCreateCharacter();

  const [name, setName] = useState('');
  const [race, setRace] = useState<string[]>([]);
  const [charClass, setCharClass] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const portalContainerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    portalContainerRef.current = document.getElementById('root');
  }, []);

  const raceCollection = useMemo(
    () =>
      createListCollection({
        items:
          racesData?.map((r) => ({
            label: r.name,
            value: r.index,
            category: 'Races',
          })) ?? [],
      }),
    [racesData]
  );

  const classCollection = useMemo(
    () =>
      createListCollection({
        items:
          classesData?.map((c) => ({
            label: c.name,
            value: c.index,
            category: 'Classes',
          })) ?? [],
      }),
    [classesData]
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please enter a name.';
    if (race.length === 0) next.race = 'Please select a race.';
    if (charClass.length === 0) next.class = 'Please select a class.';
    if (!(level >= 1 && level <= 20)) next.level = 'Level must be 1–20.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onCreate = () => {
    if (!validate()) return;
    const payload = {
      name,
      race: race[0],
      class: charClass[0],
      level,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate('/characters');
      },
    });
  };

  return (
    <>
      {isPending && <LoadingOverlay />}

      <Box
        px={4}
        py={6}
        // Reserve space for the BottomNav (≈64px) + safe area
        pb={`calc(72px + env(safe-area-inset-bottom))`}
      >
        <Stack minH="100dvh" justify="space-between">
          {/* Stack 1: all the form content */}
          <Stack gap={5} maxW="400px" mx="auto" w="100%">
            <Heading size="md">Create Character</Heading>

            {/* Name */}
            <Stack gap={1}>
              <Text fontSize="sm" color="fg.muted">
                Name
              </Text>
              <Input
                placeholder="Character name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? (
                <Text fontSize="sm" color="red.400">
                  {errors.name}
                </Text>
              ) : null}
            </Stack>

            {/* Race */}
            <Stack gap={1}>
              <Text fontSize="sm" color="fg.muted">
                Race
              </Text>
              <Select.Root
                collection={raceCollection}
                size="sm"
                width="100%"
                value={race}
                onValueChange={(v) => setRace(v.value)}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select race" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal container={portalContainerRef}>
                  <Select.Positioner>
                    <Select.Content asChild>
                      <Theme appearance="dark" hasBackground={false}>
                        {raceCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Theme>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              {errors.race ? (
                <Text fontSize="sm" color="red.400">
                  {errors.race}
                </Text>
              ) : null}
            </Stack>

            {/* Class */}
            <Stack gap={1}>
              <Text fontSize="sm" color="fg.muted">
                Class
              </Text>
              <Select.Root
                collection={classCollection}
                size="sm"
                width="100%"
                value={charClass}
                onValueChange={(v) => setCharClass(v.value)}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select class" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Portal container={portalContainerRef}>
                  <Select.Positioner>
                    <Select.Content asChild>
                      <Theme appearance="dark" hasBackground={false}>
                        {classCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Theme>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              {errors.class ? (
                <Text fontSize="sm" color="red.400">
                  {errors.class}
                </Text>
              ) : null}
            </Stack>

            {/* Level */}
            <Stack gap={1}>
              <Text fontSize="sm" color="fg.muted">
                Level
              </Text>
              <NumberInput.Root
                min={1}
                max={20}
                width="200px"
                value={String(level)}
                onValueChange={(v: any) =>
                  setLevel(Math.max(1, Math.min(20, Number(v?.value) || 1)))
                }
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
              {errors.level ? (
                <Text fontSize="sm" color="red.400">
                  {errors.level}
                </Text>
              ) : null}
            </Stack>

            {isError ? (
              <Text fontSize="sm" color="red.400">
                {(error as Error)?.message ?? 'Failed to create character.'}
              </Text>
            ) : null}
          </Stack>

          {/* Stack 2: bottom action area */}
          <Stack
            px={0}
            pt={4}
            // Stick just above the nav; add a subtle background so it doesn’t blend
            position="sticky"
            bottom={`calc(72px + env(safe-area-inset-bottom))`}
            bg="bg"
          >
            <Button
              onClick={onCreate}
              variant="solid"
              colorPalette="purple"
              disabled={isPending}
              w="100%"
              maxW="400px"
              mx="auto"
            >
              {isPending ? 'Creating…' : 'Create'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
