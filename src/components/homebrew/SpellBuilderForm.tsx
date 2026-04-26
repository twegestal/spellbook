import { Button, Divider, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import type { MetaItem } from '../../types/meta';
import { CreateSpellSchema, type CreateSpell } from '../../types/spells';
import { SpellBasicsSection } from './SpellBasicsSection';
import { SpellClassesSection } from './SpellClassesSection';
import { SpellFlagsSection } from './SpellFlagsSection';
import { SpellDamageSection } from './SpellDamageSection';
import { SpellAoeSection } from './SpellAoeSection';
import { SpellDescriptionSection } from './SpellDescriptionSection';

type Props = {
  schools: MetaItem[];
  damageTypes: MetaItem[];
  spellClasses: MetaItem[];
  initialValues?: Partial<CreateSpell>;
  onValuesChange: (values: CreateSpell) => void;
  onSubmit: (values: CreateSpell) => void;
  onCancel: () => void;
  isLoading: boolean;
};

const defaultValues: CreateSpell = {
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

export function SpellBuilderForm({
  schools,
  damageTypes,
  spellClasses,
  initialValues,
  onValuesChange,
  onSubmit,
  onCancel,
  isLoading,
}: Props) {
  const form = useForm<CreateSpell>({
    validate: zodResolver(CreateSpellSchema),
    initialValues: { ...defaultValues, ...initialValues },
    onValuesChange,
  });

  return (
    <ScrollArea h="100%">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md" p="xs">
          <Text fw={600} fz="sm">
            Basics
          </Text>
          <SpellBasicsSection form={form} schools={schools} />

          <Divider />

          <SpellClassesSection form={form} spellClasses={spellClasses} />

          <Divider />

          <Text fw={600} fz="sm">
            Properties
          </Text>
          <SpellFlagsSection form={form} />

          <Divider />

          <Text fw={600} fz="sm">
            Damage & saves
          </Text>
          <SpellDamageSection form={form} damageTypes={damageTypes} />

          <Divider />

          <Text fw={600} fz="sm">
            Area of effect
          </Text>
          <SpellAoeSection form={form} />

          <Divider />

          <Text fw={600} fz="sm">
            Description
          </Text>
          <SpellDescriptionSection form={form} />

          <Divider />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save spell
            </Button>
          </Group>
        </Stack>
      </form>
    </ScrollArea>
  );
}
