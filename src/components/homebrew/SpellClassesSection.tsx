import { MultiSelect } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';
import type { MetaItem } from '../../types/meta';

type Props = {
  form: UseFormReturnType<CreateSpell>;
  spellClasses: MetaItem[];
};

export function SpellClassesSection({ form, spellClasses }: Props) {
  const options = spellClasses.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <MultiSelect
      label="Classes"
      placeholder="Pick classes that can use this spell"
      data={options}
      value={(form.values.class_ids ?? []).map(String)}
      onChange={(val) => form.setFieldValue('class_ids', val.map(Number))}
    />
  );
}
