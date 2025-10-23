import type { RefObject } from 'react';
import type { Spell } from '../../types/spells';
import { spellDialog } from './SpellDialog';
import { AssignSpellOverlayContent } from '../spell/AssignSpellOverlayContent';

export function openAssignSpellDialog(
  spell: Spell,
  container: RefObject<HTMLDivElement | null>
) {
  spellDialog.open(`assign-${spell.id}`, {
    title: `Assign “${spell.name}”`,
    content: <AssignSpellOverlayContent spell={spell} />,
    container,
  });
}
