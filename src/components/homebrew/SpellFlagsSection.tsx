import { Checkbox, Group, Stack, Text, Textarea } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';

type Props = {
  form: UseFormReturnType<CreateSpell>;
};

export function SpellFlagsSection({ form }: Props) {
  const components = form.values.components ?? [];
  const hasMaterial = components.includes('M');

  const toggleComponent = (c: 'V' | 'S' | 'M') => {
    const next = components.includes(c)
      ? components.filter((x) => x !== c)
      : [...components, c];
    form.setFieldValue('components', next);

    if (c === 'M' && components.includes('M')) {
      form.setFieldValue('material', null);
    }
  };

  return (
    <Stack gap="xs">
      <Group gap="xl">
        <Checkbox
          label="Concentration"
          checked={form.values.concentration}
          onChange={(e) =>
            form.setFieldValue('concentration', e.currentTarget.checked)
          }
        />
        <Checkbox
          label="Ritual"
          checked={form.values.ritual}
          onChange={(e) =>
            form.setFieldValue('ritual', e.currentTarget.checked)
          }
        />
      </Group>
      <Stack gap={4}>
        <Text fz="sm" fw={500}>
          Components
        </Text>
        <Group gap="sm">
          {(['V', 'S', 'M'] as const).map((c) => (
            <Checkbox
              key={c}
              label={c}
              checked={components.includes(c)}
              onChange={() => toggleComponent(c)}
            />
          ))}
        </Group>
      </Stack>

      {hasMaterial && (
        <Textarea
          label="Material component"
          placeholder="e.g. A pinch of sulfur worth at least 25 gp, consumed by the spell"
          autosize
          minRows={2}
          value={form.values.material ?? ''}
          onChange={(e) =>
            form.setFieldValue('material', e.currentTarget.value || null)
          }
        />
      )}
    </Stack>
  );
}
