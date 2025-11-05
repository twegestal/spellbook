import { useState, useEffect, startTransition } from 'react';
import { ActionIcon, Group, TextInput } from '@mantine/core';
import { Search, X } from 'lucide-react';

type Props = { initialValue?: string; onChange: (v: string) => void };

export default function SpellSearch({ initialValue = '', onChange }: Props) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <Group gap="xs" wrap="nowrap" w="100%">
      <TextInput
        placeholder="Search spells..."
        value={value}
        onChange={(e) => {
          const v = e.currentTarget.value;
          setValue(v);
          startTransition(() => onChange(v));
        }}
        leftSection={<Search size={18} style={{ opacity: 0.6 }} />}
        rightSection={
          value ? (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={() => {
                setValue('');
                startTransition(() => onChange(''));
              }}
            >
              <X size={16} />
            </ActionIcon>
          ) : null
        }
        radius="md"
        size="sm"
        styles={{ input: { minWidth: 220, fontSize: 14 } }}
      />
    </Group>
  );
}
