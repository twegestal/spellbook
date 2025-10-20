import type { Spell } from '../../types/spells';
import { Card, HStack, Text, Badge, IconButton } from '@chakra-ui/react';
import type { FC, MouseEvent, PointerEvent, KeyboardEvent } from 'react';
import { CiCirclePlus } from 'react-icons/ci';

type Props = {
  spell: Spell;
  onOpenDetails: () => void;
};

export const SpellListItem: FC<Props> = ({ spell, onOpenDetails }) => {
  const onCardClick = () => onOpenDetails();

  const stop = (e: MouseEvent | PointerEvent | KeyboardEvent) => {
    e.stopPropagation();
  };

  const onPlusClick = (e: MouseEvent) => {
    e.stopPropagation();
    // TODO: add-to-list logic here
    console.log('clicked');
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
        <HStack justifyContent="space-between">
          <HStack>
            <IconButton
              type="button"
              size="lg"
              variant="outline"
              aria-label={`Add ${spell.name}`}
              onPointerDown={stop}
              onClick={onPlusClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') stop(e);
              }}
            >
              <CiCirclePlus />
            </IconButton>
            <Text>{spell.name}</Text>
          </HStack>
          <Badge colorPalette="purple">
            {spell.level === 0 ? 'cantrip' : `Level ${spell.level}`}
          </Badge>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
