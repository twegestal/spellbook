import type { FC, MouseEvent, PointerEvent, KeyboardEvent } from 'react';
import { Card, HStack, Text, Badge, Stack } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import { toaster } from '../ui';

type Props = {
  spell: Spell;
  onOpenDetails: () => void;
  onCast?: (spell: Spell) => void;
};

export const PreparedSpellListItem: FC<Props> = ({
  spell,
  onOpenDetails,
  onCast,
}) => {
  const onCardClick = () => onOpenDetails();

  const stop = (e: MouseEvent | PointerEvent | KeyboardEvent) =>
    e.stopPropagation();

  const school =
    typeof spell.school === 'string' ? spell.school : spell.school?.name;

  const handleCast = (e: MouseEvent) => {
    e.stopPropagation();
    if (onCast) {
      onCast(spell);
    } else {
      console.log(`Cast spell: ${spell.name} (${spell.index})`);
      toaster.create({
        title: 'Cast spell',
        description: `"${spell.name}" cast initiated.`,
        type: 'success',
        closable: true,
      });
    }
  };

  return (
    <Card.Root
      as="li"
      size="sm"
      onClick={onCardClick}
      cursor="pointer"
      _active={{ transform: 'scale(0.998)' }}
    >
      <Card.Body color="fg.muted">
        <HStack justifyContent="space-between" align="start">
          <Stack gap={0}>
            <Text>{spell.name}</Text>
            {school ? <Text textStyle={'xs'}>{school}</Text> : null}
            {spell.concentration ? (
              <Text textStyle="xs">
                Concentration
                {spell.duration ? ` ${spell.duration.toLowerCase()}` : ''}
              </Text>
            ) : null}
          </Stack>

          <HStack>
            <Badge
              as="button"
              onClick={handleCast}
              onPointerDown={stop}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') stop(e);
              }}
              colorPalette="purple"
              cursor="pointer"
            >
              Cast spell
            </Badge>
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
