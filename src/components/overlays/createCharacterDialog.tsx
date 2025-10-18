import {
  Dialog,
  Portal,
  Button,
  Stack,
  Input,
  NativeSelect,
  Field,
} from '@chakra-ui/react';
import { createOverlay } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useCreateCharacter } from '../../hooks/useCharacters';
import { useRaces, useClasses } from '../../hooks/useMetadata';

export const createCharacterDialog = createOverlay((props) => {
  const { id, ...rest } = props;

  const { data: races, isLoading: racesLoading } = useRaces();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const create = useCreateCharacter();

  const [name, setName] = useState('');
  const [raceIndex, setRaceIndex] = useState('');
  const [classIndex, setClassIndex] = useState('');
  const [level, setLevel] = useState<number>(1);

  const errors = {
    name: name.trim() ? '' : 'Name is required',
    raceIndex: raceIndex ? '' : 'Race is required',
    classIndex: classIndex ? '' : 'Class is required',
    level: level >= 1 && level <= 20 ? '' : 'Level must be 1–20',
  };

  const isInvalid =
    !!errors.name ||
    !!errors.raceIndex ||
    !!errors.classIndex ||
    !!errors.level;

  const disabled = create.isPending || racesLoading || classesLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    const race = races?.find((r) => r.index === raceIndex);
    const klass = classes?.find((c) => c.index === classIndex);

    const created = await create.mutateAsync({
      name: name.trim(),
      race: race?.name ?? '',
      class: klass?.name ?? '',
      level,
    });

    setName('');
    setRaceIndex('');
    setClassIndex('');
    setLevel(1);

    await createCharacterDialog.close(id, created);
  };

  const levelOptions = useMemo(
    () => Array.from({ length: 20 }, (_, i) => i + 1),
    []
  );

  return (
    <Dialog.Root size={{ base: 'full', sm: 'md' }} {...rest}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create character</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form id="create-character-form" onSubmit={onSubmit} noValidate>
                <Stack gap={3}>
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>Name</Field.Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      autoFocus
                      fontSize="16px"
                      inputMode="text"
                      disabled={disabled}
                      placeholder="E.g. Elryn, Thava, Kael"
                    />
                    {errors.name ? (
                      <Field.ErrorText>{errors.name}</Field.ErrorText>
                    ) : null}
                  </Field.Root>

                  <Field.Root invalid={!!errors.raceIndex}>
                    <Field.Label>Race</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        id="char-race"
                        placeholder={racesLoading ? 'Loading…' : 'Choose race'}
                        value={raceIndex}
                        onChange={(e) => setRaceIndex(e.target.value)}
                      >
                        {/* If you want a real placeholder option as well, keep this: */}
                        <option value="" />
                        {races?.map((r) => (
                          <option key={r.index} value={r.index}>
                            {r.name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.raceIndex ? (
                      <Field.ErrorText>{errors.raceIndex}</Field.ErrorText>
                    ) : null}
                  </Field.Root>

                  <Field.Root invalid={!!errors.classIndex}>
                    <Field.Label>Class</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        id="char-class"
                        placeholder={
                          classesLoading ? 'Loading…' : 'Choose class'
                        }
                        value={classIndex}
                        onChange={(e) => setClassIndex(e.target.value)}
                      >
                        <option value="" />
                        {classes?.map((c) => (
                          <option key={c.index} value={c.index}>
                            {c.name}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.classIndex ? (
                      <Field.ErrorText>{errors.classIndex}</Field.ErrorText>
                    ) : null}
                  </Field.Root>

                  <Field.Root invalid={!!errors.level}>
                    <Field.Label>Level</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        id="char-level"
                        value={String(level)}
                        onChange={(e) => setLevel(Number(e.target.value))}
                      >
                        {levelOptions.map((n) => (
                          <option key={n} value={n}>
                            Level {n}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.level ? (
                      <Field.ErrorText>{errors.level}</Field.ErrorText>
                    ) : null}
                  </Field.Root>
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" disabled={create.isPending}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="create-character-form"
                loading={create.isPending}
                disabled={disabled || isInvalid}
              >
                Create
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
