import { SimpleGrid, TextInput, NumberInput, Select } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';
import type { MetaItem } from '../../types/meta';

type Props = {
  form: UseFormReturnType<CreateSpell>;
  schools: MetaItem[];
};

export function SpellBasicsSection({ form, schools }: Props) {
  const schoolOptions = schools.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  return (
    <SimpleGrid cols={2} spacing="sm">
      <TextInput
        label="Name"
        placeholder="Fireball"
        required
        {...form.getInputProps('name')}
      />
      <NumberInput
        label="Level"
        placeholder="0–9"
        min={0}
        max={9}
        required
        {...form.getInputProps('level')}
      />
      <Select
        label="School"
        placeholder="Pick a school"
        data={schoolOptions}
        required
        value={form.values.school_id ? String(form.values.school_id) : null}
        onChange={(val) =>
          form.setFieldValue('school_id', val ? Number(val) : 0)
        }
      />
      <TextInput
        label="Casting time"
        placeholder="1 action"
        required
        {...form.getInputProps('casting_time')}
      />
      <TextInput
        label="Range"
        placeholder="60 feet"
        required
        {...form.getInputProps('range')}
      />
      <TextInput
        label="Duration"
        placeholder="Instantaneous"
        required
        {...form.getInputProps('duration')}
      />
    </SimpleGrid>
  );
}
