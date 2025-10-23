import type { FC, MouseEvent, PointerEvent, KeyboardEvent } from 'react';
import { Card, HStack, Text, Badge } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import {
  useAddPreparedSpell,
  useRemovePreparedSpell,
} from '../../hooks/useCharacters';
import { toaster } from '../ui';

type Props = {
  characterId: string;
  spell: Spell;
  isPrepared: boolean;
  onOpenDetails: () => void;
};

export const KnownSpellListItem: FC<Props> = ({
  characterId,
  spell,
  isPrepared,
  onOpenDetails,
}) => {
  const { mutateAsync: addAsync, isPending: adding } = useAddPreparedSpell();
  const { mutateAsync: removeAsync, isPending: removing } =
    useRemovePreparedSpell();

  const busy = adding || removing;
  const spellId = String(spell.id);

  const onCardClick = () => {
    if (!busy) onOpenDetails();
  };

  const stop = (e: MouseEvent | PointerEvent | KeyboardEvent) =>
    e.stopPropagation();

  const onTogglePrepared = async (e: MouseEvent) => {
    e.stopPropagation();
    if (busy) return;

    try {
      if (isPrepared) {
        await removeAsync({ characterId, spellId });
        toaster.create({
          title: 'Spell unprepared',
          description: `"${spell.name}" removed from prepared spells.`,
          type: 'success',
          closable: true,
        });
      } else {
        await addAsync({ characterId, spellId });
        toaster.create({
          title: 'Spell prepared',
          description: `"${spell.name}" is now prepared.`,
          type: 'success',
          closable: true,
        });
      }
    } catch (err: any) {
      toaster.create({
        title: 'Action failed',
        description: err?.message ?? 'Please try again.',
        type: 'error',
        closable: true,
      });
    }
  };

  return (
    <Card.Root
      as="li"
      size="sm"
      onClick={onCardClick}
      cursor={busy ? 'not-allowed' : 'pointer'}
      opacity={busy ? 0.7 : 1}
      _active={{ transform: busy ? undefined : 'scale(0.998)' }}
    >
      <Card.Body color="fg.muted">
        <HStack justifyContent="space-between">
          <HStack>
            <Text>{spell.name}</Text>
          </HStack>

          <HStack>
            <Badge
              as="button"
              onClick={onTogglePrepared}
              onPointerDown={stop}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') stop(e);
              }}
              colorPalette={isPrepared ? 'red' : 'gray'}
              cursor={busy ? 'not-allowed' : 'pointer'}
              opacity={busy ? 0.8 : 1}
            >
              {isPrepared ? 'Prepared' : 'Prepare'}
            </Badge>

            <Badge colorPalette="purple">
              {spell.level === 0 ? 'cantrip' : `Level ${spell.level}`}
            </Badge>
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
