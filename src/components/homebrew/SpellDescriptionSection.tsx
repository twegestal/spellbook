import { Stack, Text, Textarea } from '@mantine/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import type { UseFormReturnType } from '@mantine/form';
import type { CreateSpell } from '../../types/spells';

type Props = {
  form: UseFormReturnType<CreateSpell>;
};

export function SpellDescriptionSection({ form }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.values.description.join('\n\n'),
    onUpdate({ editor }) {
      const text = editor.getText({ blockSeparator: '\n\n' });
      const paragraphs = text
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);
      form.setFieldValue('description', paragraphs);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <Stack gap="sm">
      <Stack gap={4}>
        <Text fz="sm" fw={500}>
          Description
        </Text>
        <div
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: 'var(--mantine-radius-sm)',
            padding: '8px 12px',
            minHeight: 120,
            fontSize: '0.875rem',
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </Stack>
      <Textarea
        label="At higher levels"
        placeholder="When you cast this spell using a spell slot of 2nd level or higher..."
        autosize
        minRows={2}
        value={form.values.higher_level.join('\n\n')}
        onChange={(e) => {
          const paragraphs = e.currentTarget.value
            .split('\n\n')
            .map((p) => p.trim())
            .filter(Boolean);
          form.setFieldValue('higher_level', paragraphs);
        }}
      />
    </Stack>
  );
}
