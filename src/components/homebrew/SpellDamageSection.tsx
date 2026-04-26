import { Select, SimpleGrid } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';
import type { MetaItem } from '../../types/meta';

type Props = {
  form: UseFormReturnType<CreateSpell>;
  damageTypes: MetaItem[];
};

const ATTACK_TYPES = [
  { value: 'melee', label: 'Melee' },
  { value: 'ranged', label: 'Ranged' },
];

const DC_TYPES = [
  { value: 'str', label: 'Strength' },
  { value: 'dex', label: 'Dexterity' },
  { value: 'con', label: 'Constitution' },
  { value: 'int', label: 'Intelligence' },
  { value: 'wis', label: 'Wisdom' },
  { value: 'cha', label: 'Charisma' },
];

const DC_SUCCESS = [
  { value: 'none', label: 'None' },
  { value: 'half', label: 'Half damage' },
  { value: 'other', label: 'Other' },
];

export function SpellDamageSection({ form, damageTypes }: Props) {
  const damageTypeOptions = damageTypes.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  return (
    <SimpleGrid cols={2} spacing="sm">
      <Select
        label="Attack type"
        placeholder="None"
        clearable
        data={ATTACK_TYPES}
        value={form.values.attack_type ?? null}
        onChange={(val) =>
          form.setFieldValue('attack_type', (val as 'melee' | 'ranged') ?? null)
        }
      />
      <Select
        label="Damage type"
        placeholder="None"
        clearable
        data={damageTypeOptions}
        value={
          form.values.damage_type_id ? String(form.values.damage_type_id) : null
        }
        onChange={(val) =>
          form.setFieldValue('damage_type_id', val ? Number(val) : null)
        }
      />
      <Select
        label="Saving throw"
        placeholder="None"
        clearable
        data={DC_TYPES}
        value={form.values.dc_type ?? null}
        onChange={(val) =>
          form.setFieldValue('dc_type', (val as CreateSpell['dc_type']) ?? null)
        }
      />
      <Select
        label="On save"
        placeholder="None"
        clearable
        data={DC_SUCCESS}
        value={form.values.dc_success ?? null}
        onChange={(val) =>
          form.setFieldValue(
            'dc_success',
            (val as CreateSpell['dc_success']) ?? null,
          )
        }
      />
    </SimpleGrid>
  );
}
