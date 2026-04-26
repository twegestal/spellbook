import { Select, NumberInput, SimpleGrid } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';

type Props = {
  form: UseFormReturnType<CreateSpell>;
};

const AOE_TYPES = [
  { value: 'sphere', label: 'Sphere' },
  { value: 'cube', label: 'Cube' },
  { value: 'cone', label: 'Cone' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'line', label: 'Line' },
];

export function SpellAoeSection({ form }: Props) {
  return (
    <SimpleGrid cols={2} spacing="sm">
      <Select
        label="Area of effect"
        placeholder="None"
        clearable
        data={AOE_TYPES}
        value={form.values.aoe_type ?? null}
        onChange={(val) =>
          form.setFieldValue(
            'aoe_type',
            (val as CreateSpell['aoe_type']) ?? null,
          )
        }
      />
      <NumberInput
        label="Size (feet)"
        placeholder="e.g. 20"
        min={0}
        disabled={!form.values.aoe_type}
        value={form.values.aoe_size ?? ''}
        onChange={(val) =>
          form.setFieldValue('aoe_size', val === '' ? null : Number(val))
        }
      />
    </SimpleGrid>
  );
}
