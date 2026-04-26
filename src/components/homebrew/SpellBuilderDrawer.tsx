import { useEffect, useState } from 'react';
import { Drawer, Grid, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { CreateSpell, Spell } from '../../types/spells';
import type { MetaItem } from '../../types/meta';
import { SpellBuilderForm } from './SpellBuilderForm';
import { SpellPreview } from './SpellPreview';
import {
  useCreateHomebrewSpell,
  useUpdateHomebrewSpell,
} from '../../hooks/useHomebrewSpells';

type Props = {
  opened: boolean;
  onClose: () => void;
  schools: MetaItem[];
  damageTypes: MetaItem[];
  spellClasses: MetaItem[];
  editSpell?: Spell;
};

const emptyValues: CreateSpell = {
  name: '',
  level: 1,
  casting_time: '',
  range: '',
  duration: '',
  concentration: false,
  ritual: false,
  attack_type: null,
  components: [],
  material: null,
  school_id: 0,
  damage_type_id: null,
  dc_type: null,
  dc_success: null,
  dc_desc: null,
  aoe_type: null,
  aoe_size: null,
  description: [],
  higher_level: [],
  class_ids: [],
};

function spellToFormValues(spell: Spell): Partial<CreateSpell> {
  return {
    name: spell.name,
    level: spell.level,
    casting_time: spell.casting_time,
    range: spell.range,
    duration: spell.duration,
    concentration: spell.concentration,
    ritual: spell.ritual,
    attack_type: spell.attack_type,
    components: spell.components,
    material: spell.material,
    school_id: spell.school_id,
    damage_type_id: spell.damage_type_id,
    dc_type: spell.dc_type,
    dc_success: spell.dc_success,
    dc_desc: spell.dc_desc,
    aoe_type: spell.aoe_type,
    aoe_size: spell.aoe_size,
    description: spell.description,
    higher_level: spell.higher_level,
    class_ids: spell.class_ids ?? [],
  };
}

export function SpellBuilderDrawer({
  opened,
  onClose,
  schools,
  damageTypes,
  spellClasses,
  editSpell,
}: Props) {
  const isEditing = !!editSpell;
  const initialValues = editSpell ? spellToFormValues(editSpell) : undefined;

  const [previewValues, setPreviewValues] = useState<CreateSpell>({
    ...emptyValues,
    ...initialValues,
  });

  useEffect(() => {
    if (editSpell) {
      setPreviewValues({ ...emptyValues, ...spellToFormValues(editSpell) });
    } else {
      setPreviewValues(emptyValues);
    }
  }, [editSpell]);

  const createMutation = useCreateHomebrewSpell();
  const updateMutation = useUpdateHomebrewSpell();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CreateSpell) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editSpell.id, input: values });
        notifications.show({ message: 'Spell updated!', color: 'green' });
      } else {
        await createMutation.mutateAsync(values);
        notifications.show({ message: 'Spell created!', color: 'green' });
      }
      onClose();
    } catch {
      notifications.show({ message: 'Something went wrong', color: 'red' });
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={isEditing ? `Edit — ${editSpell.name}` : 'Create spell'}
      size="100%"
      position="bottom"
    >
      <LoadingOverlay visible={isLoading} />
      <Grid h="calc(100vh - 80px)" gutter="md">
        <Grid.Col span={6}>
          <SpellBuilderForm
            schools={schools}
            damageTypes={damageTypes}
            spellClasses={spellClasses}
            initialValues={initialValues}
            onValuesChange={setPreviewValues}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <SpellPreview
            values={previewValues}
            schools={schools}
            damageTypes={damageTypes}
            spellClasses={spellClasses}
          />
        </Grid.Col>
      </Grid>
    </Drawer>
  );
}
