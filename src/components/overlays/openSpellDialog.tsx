import type { RefObject } from 'react';
import type { Spell } from '@/types/spells';
import { spellDialog } from './SpellDialog';
import { SpellOverlayContent } from '../spell/SpellOverlayContent';

export function openSpellDialog(
  spell: Spell,
  container: RefObject<HTMLDivElement | null>
) {
  spellDialog.open(spell.id ?? spell.name, {
    title: spell.name,
    content: <SpellOverlayContent spell={spell} />,
    container,
  });
}
