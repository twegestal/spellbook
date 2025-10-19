import type { Spell } from '../../types/spells';
import { Stack, Text, Badge, Separator } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
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
  const levelLabel =
    spell.level === 0 ? 'Cantrip' : String('Level ' + spell.level);
  const school =
    typeof spell.school === 'string' ? spell.school : spell.school?.name;
  const components = Array.isArray(spell.components) ? spell.components : [];
  const classes = Array.isArray(spell.classes) ? spell.classes : [];
  const desc = Array.isArray(spell.desc) ? spell.desc : [];
  const higherLevelDesc = Array.isArray(spell.higher_level)
    ? spell.higher_level
    : [];
  const savingThrow = spell.dc?.dc_type?.name;
  const damageType = spell.damage?.damage_type?.name;

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} wrap="wrap">
        <Badge colorPalette={'purple'}>{levelLabel}</Badge>
        {school ? <Badge colorPalette={'teal'}>{school}</Badge> : null}
        {spell.ritual ? <Badge colorPalette={'cyan'}>Ritual</Badge> : null}
        {spell.concentration ? (
          <Badge colorPalette={'red'}>Concentration</Badge>
        ) : null}
      </Stack>

      {spell.casting_time || spell.range || spell.duration ? (
        <Stack gap={1}>
          {spell.casting_time ? (
            <Field label="Casting time">{spell.casting_time}</Field>
          ) : null}
          {spell.range ? <Field label="Range">{spell.range}</Field> : null}
          {spell.duration ? (
            <Field label="Duration">{spell.duration}</Field>
          ) : null}
        </Stack>
      ) : null}

      {/* Components */}
      {components.length ? (
        <Field label="Components">
          {components.join(', ')}
          {spell.material ? <Text as="span"> — {spell.material}</Text> : null}
        </Field>
      ) : null}

      {/* Classes */}
      {classes.length ? (
        <Field label="Classes">
          {classes
            .map((c) => c?.name)
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
