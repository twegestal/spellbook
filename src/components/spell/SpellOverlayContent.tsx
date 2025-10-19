import { useSpellByIndex } from '../../hooks/useSpell';
import type { Spell } from '../../types/spells';
import { Box, Stack, Text, Badge, Separator } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { LoadingSpinner } from './../overlays/LoadingSpinner';
import { DAMAGE_TYPE_COLORS } from '../../util/damageColors';

type Props = { spell: Spell };

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Text fontSize="sm">
    <Text as="span" color="fg.muted">
      {label}:{' '}
    </Text>
    <Text as="span" fontWeight="medium">
      {children}
    </Text>
  </Text>
);

export const SpellOverlayContent: FC<Props> = ({ spell }) => {
  const { data, isLoading, isError, error } = useSpellByIndex(spell.index);

  if (isLoading) {
    return (
      <Box py={6} display="grid" placeItems="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box py={4}>
        <Text color="red.500">Failed to load spell details.</Text>
        <Text fontSize="sm" opacity={0.7}>
          {(error as Error)?.message ?? 'Unknown error'}
        </Text>
      </Box>
    );
  }

  if (!data) {
    return <Text opacity={0.7}>No details available.</Text>;
  }

  const levelLabel =
    spell.level === 0 ? 'Cantrip' : String('Level ' + spell.level);
  const school =
    typeof data.school === 'string' ? data.school : data.school?.name;
  const components = Array.isArray(data.components) ? data.components : [];
  const classes = Array.isArray(data.classes) ? data.classes : [];
  const desc = Array.isArray(data.desc) ? data.desc : [];
  const higherLevelDesc = Array.isArray(data.higher_level)
    ? data.higher_level
    : [];
  const savingThrow = data.dc?.dc_type?.name;
  const damageType = data.damage?.damage_type?.name;

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} wrap="wrap">
        <Badge colorPalette={'purple'}>{levelLabel}</Badge>
        {school ? <Badge colorPalette={'teal'}>{school}</Badge> : null}
        {data.ritual ? <Badge colorPalette={'cyan'}>Ritual</Badge> : null}
        {data.concentration ? (
          <Badge colorPalette={'red'}>Concentration</Badge>
        ) : null}
      </Stack>

      {data.casting_time || data.range || data.duration ? (
        <Stack gap={1}>
          {data.casting_time ? (
            <Field label="Casting time">{data.casting_time}</Field>
          ) : null}
          {data.range ? <Field label="Range">{data.range}</Field> : null}
          {data.duration ? (
            <Field label="Duration">{data.duration}</Field>
          ) : null}
        </Stack>
      ) : null}

      {/* Components */}
      {components.length ? (
        <Field label="Components">
          {components.join(', ')}
          {data.material ? <Text as="span"> — {data.material}</Text> : null}
        </Field>
      ) : null}

      {/* Classes */}
      {classes.length ? (
        <Field label="Classes">
          {classes
            .map((c: any) => c?.name)
            .filter(Boolean)
            .join(', ')}
        </Field>
      ) : null}

      {/* DC */}
      {savingThrow ? <Field label="Saving throw">{savingThrow}</Field> : null}

      {/* Damage type */}
      {damageType ? (
        <Field label="Damage type">
          <Badge
            colorPalette={
              DAMAGE_TYPE_COLORS[damageType.toLowerCase()] ?? 'gray'
            }
          >
            {damageType}
          </Badge>
        </Field>
      ) : null}

      {/* Description */}
      {desc.length ? (
        <>
          <Separator />
          <Stack gap={3}>
            {desc.map((p: string, i: number) => (
              <Text key={i} whiteSpace="pre-wrap">
                {p}
              </Text>
            ))}
          </Stack>
        </>
      ) : null}

      {/* Higher level description */}
      {higherLevelDesc.length ? (
        <>
          <Separator />
          <Stack gap={3}>
            {higherLevelDesc.map((p: string, i: number) => (
              <Text key={i} whiteSpace="pre-wrap">
                {p}
              </Text>
            ))}
          </Stack>
        </>
      ) : null}
    </Stack>
  );
};
