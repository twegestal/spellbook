import { modals } from '@mantine/modals';
import type { Spell } from '../../types/spells';
import { AssignSpellModalContent } from '../spell/AssignSpellModalContent';

export function openAssignSpellModal(spell: Spell) {
  const modalId = `assign-${spell.id ?? spell.name}`;

  modals.open({
    modalId,
    size: 'lg',
    withCloseButton: true,
    centered: true,
    title: `Assign “${spell.name}”`,
    children: <AssignSpellModalContent spell={spell} modalId={modalId} />,
    overlayProps: { opacity: 0.35, blur: 2 },
  });
}
